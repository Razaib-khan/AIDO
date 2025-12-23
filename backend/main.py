import uvicorn
import json
import uuid
from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from auth import get_current_user
from models import (
    User, Product, CartItem, Order, OrderItem, Address, WishlistItem
)
from database import get_session

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://localhost:3004",
        "http://localhost:3005",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
        "http://127.0.0.1:3003",
        "http://127.0.0.1:3004",
        "http://127.0.0.1:3005",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the FastAPI Backend linked with Better Auth!"}

@app.get("/me")
def read_current_user(user: User = Depends(get_current_user)):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "image": user.image,
        "isBuyer": user.isBuyer,
        "isSeller": user.isSeller,
        "sellerVerified": user.sellerVerified,
        "message": "This data comes from the shared PostgreSQL database, authenticated via Better Auth session."
    }


# ============ AUTH ENDPOINTS ============

@app.post("/auth/signup")
def signup(
    email: str,
    password: str,
    name: str,
    isBuyer: bool = True,
    isSeller: bool = False,
    sellerVerified: bool = False,
    session: Session = Depends(get_session)
):
    """Create a new user account"""
    print(f"\n[BACKEND-SIGNUP] ========== SIGNUP REQUEST RECEIVED ==========")
    print(f"[BACKEND-SIGNUP] Email: {email}")
    print(f"[BACKEND-SIGNUP] Name: {name}")
    print(f"[BACKEND-SIGNUP] isBuyer: {isBuyer}, isSeller: {isSeller}")

    # Check if user already exists
    print(f"[BACKEND-SIGNUP] Checking if user exists...")
    existing_user = session.exec(
        select(User).where(User.email == email)
    ).first()
    print(f"[BACKEND-SIGNUP] Existing user check complete")

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    # Create new user (password should already be hashed by frontend)
    new_user = User(
        id=str(uuid.uuid4()),
        name=name,
        email=email,
        emailVerified=False,
        password=password,  # Store the hashed password
        isBuyer=isBuyer,
        isSeller=isSeller,
        sellerVerified=sellerVerified,
        createdAt=datetime.utcnow(),
        updatedAt=datetime.utcnow(),
    )

    session.add(new_user)
    session.commit()
    session.refresh(new_user)

    print(f"[SIGNUP] User created successfully: {new_user.email}")

    return {
        "id": new_user.id,
        "name": new_user.name,
        "email": new_user.email,
        "isBuyer": new_user.isBuyer,
        "isSeller": new_user.isSeller,
    }


# ============ PRODUCT ENDPOINTS ============

@app.get("/products")
def list_products(
    skip: int = 0,
    limit: int = 20,
    category: str = None,
    freshness: str = None,
    search: str = None,
    session: Session = Depends(get_session)
):
    """List all products with optional filtering"""
    query = select(Product).where(Product.isActive == True)

    if category:
        query = query.where(Product.category == category)
    if freshness:
        query = query.where(Product.freshness == freshness)
    if search:
        query = query.where(Product.name.ilike(f"%{search}%"))

    query = query.offset(skip).limit(limit)
    products = session.exec(query).all()
    return products


@app.get("/products/{product_id}")
def get_product(product_id: str, session: Session = Depends(get_session)):
    """Get product details"""
    product = session.exec(
        select(Product).where(Product.id == product_id)
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@app.post("/products")
def create_product(
    name: str,
    description: str,
    category: str,
    price: float,
    unit: str,
    stock: int,
    freshness: str,
    images: list = None,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Create a new product (seller only)"""
    if not user.isSeller:
        raise HTTPException(status_code=403, detail="User is not a seller")

    product = Product(
        id=str(uuid.uuid4()),
        sellerId=user.id,
        name=name,
        description=description,
        category=category,
        price=price,
        unit=unit,
        stock=stock,
        freshness=freshness,
        images=json.dumps(images) if images else None
    )
    session.add(product)
    session.commit()
    session.refresh(product)
    return product


@app.put("/products/{product_id}")
def update_product(
    product_id: str,
    name: str = None,
    description: str = None,
    category: str = None,
    price: float = None,
    unit: str = None,
    stock: int = None,
    freshness: str = None,
    images: list = None,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Update product (seller only)"""
    if not user.isSeller:
        raise HTTPException(status_code=403, detail="User is not a seller")

    product = session.exec(
        select(Product).where(Product.id == product_id)
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.sellerId != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this product")

    if name:
        product.name = name
    if description:
        product.description = description
    if category:
        product.category = category
    if price is not None:
        product.price = price
    if unit:
        product.unit = unit
    if stock is not None:
        product.stock = stock
    if freshness:
        product.freshness = freshness
    if images:
        product.images = json.dumps(images)

    product.updatedAt = datetime.utcnow()
    session.add(product)
    session.commit()
    session.refresh(product)
    return product


@app.delete("/products/{product_id}")
def delete_product(
    product_id: str,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Delete product (seller only)"""
    if not user.isSeller:
        raise HTTPException(status_code=403, detail="User is not a seller")

    product = session.exec(
        select(Product).where(Product.id == product_id)
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.sellerId != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this product")

    session.delete(product)
    session.commit()
    return {"message": "Product deleted"}


@app.get("/seller/products")
def get_seller_products(
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get current seller's products"""
    if not user.isSeller:
        raise HTTPException(status_code=403, detail="User is not a seller")

    products = session.exec(
        select(Product).where(Product.sellerId == user.id)
    ).all()
    return products


# ============ CART ENDPOINTS ============

@app.get("/cart")
def get_cart(
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get user's cart"""
    cart_items = session.exec(
        select(CartItem).where(CartItem.userId == user.id)
    ).all()

    result = []
    for item in cart_items:
        product = session.exec(
            select(Product).where(Product.id == item.productId)
        ).first()
        if product:
            result.append({
                "cartItemId": item.id,
                "product": product,
                "quantity": item.quantity
            })
    return result


@app.post("/cart")
def add_to_cart(
    product_id: str,
    quantity: int,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Add item to cart"""
    product = session.exec(
        select(Product).where(Product.id == product_id)
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Check if item already in cart
    existing_item = session.exec(
        select(CartItem).where(
            (CartItem.userId == user.id) & (CartItem.productId == product_id)
        )
    ).first()

    if existing_item:
        existing_item.quantity += quantity
        session.add(existing_item)
    else:
        cart_item = CartItem(
            id=str(uuid.uuid4()),
            userId=user.id,
            productId=product_id,
            quantity=quantity
        )
        session.add(cart_item)

    session.commit()
    return {"message": "Item added to cart"}


@app.put("/cart/{cart_item_id}")
def update_cart_item(
    cart_item_id: str,
    quantity: int,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Update cart item quantity"""
    cart_item = session.exec(
        select(CartItem).where(CartItem.id == cart_item_id)
    ).first()
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    if cart_item.userId != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    if quantity <= 0:
        session.delete(cart_item)
    else:
        cart_item.quantity = quantity
        session.add(cart_item)

    session.commit()
    return {"message": "Cart item updated"}


@app.delete("/cart/{cart_item_id}")
def remove_from_cart(
    cart_item_id: str,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Remove item from cart"""
    cart_item = session.exec(
        select(CartItem).where(CartItem.id == cart_item_id)
    ).first()
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    if cart_item.userId != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    session.delete(cart_item)
    session.commit()
    return {"message": "Item removed from cart"}


@app.delete("/cart")
def clear_cart(
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Clear entire cart"""
    cart_items = session.exec(
        select(CartItem).where(CartItem.userId == user.id)
    ).all()

    for item in cart_items:
        session.delete(item)

    session.commit()
    return {"message": "Cart cleared"}


# ============ ORDER ENDPOINTS ============

@app.post("/orders")
def create_order(
    seller_id: str,
    cart_items: list,  # [{cartItemId, quantity}, ...]
    shipping_address: dict,
    payment_method: str,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Create order from cart"""
    if not user.isBuyer:
        raise HTTPException(status_code=403, detail="User is not a buyer")

    total_price = 0
    order_items_data = []

    # Verify all items and calculate total
    for item_data in cart_items:
        cart_item = session.exec(
            select(CartItem).where(CartItem.id == item_data["cartItemId"])
        ).first()

        if not cart_item or cart_item.userId != user.id:
            raise HTTPException(status_code=404, detail="Cart item not found")

        product = session.exec(
            select(Product).where(Product.id == cart_item.productId)
        ).first()

        if not product or product.stock < item_data["quantity"]:
            raise HTTPException(status_code=400, detail=f"Product {product.name if product else 'unknown'} out of stock")

        total_price += product.price * item_data["quantity"]
        order_items_data.append({
            "productId": product.id,
            "quantity": item_data["quantity"],
            "priceAtPurchase": product.price
        })

    # Create order
    order = Order(
        id=str(uuid.uuid4()),
        buyerId=user.id,
        sellerId=seller_id,
        status="pending",
        totalPrice=total_price,
        shippingAddress=json.dumps(shipping_address),
        paymentMethod=payment_method
    )
    session.add(order)
    session.flush()

    # Create order items and reduce stock
    for item_data in order_items_data:
        order_item = OrderItem(
            id=str(uuid.uuid4()),
            orderId=order.id,
            productId=item_data["productId"],
            quantity=item_data["quantity"],
            priceAtPurchase=item_data["priceAtPurchase"]
        )
        session.add(order_item)

        # Reduce product stock
        product = session.exec(
            select(Product).where(Product.id == item_data["productId"])
        ).first()
        product.stock -= item_data["quantity"]
        session.add(product)

    # Clear user's cart
    cart_items_to_delete = session.exec(
        select(CartItem).where(CartItem.userId == user.id)
    ).all()
    for cart_item in cart_items_to_delete:
        session.delete(cart_item)

    session.commit()
    session.refresh(order)
    return order


@app.get("/orders")
def get_user_orders(
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get buyer's orders"""
    orders = session.exec(
        select(Order).where(Order.buyerId == user.id)
    ).all()
    return orders


@app.get("/orders/{order_id}")
def get_order(
    order_id: str,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get order details"""
    order = session.exec(
        select(Order).where(Order.id == order_id)
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.buyerId != user.id and order.sellerId != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to view this order")

    order_items = session.exec(
        select(OrderItem).where(OrderItem.orderId == order_id)
    ).all()

    return {
        "order": order,
        "items": order_items
    }


@app.get("/seller/orders")
def get_seller_orders(
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get seller's incoming orders"""
    if not user.isSeller:
        raise HTTPException(status_code=403, detail="User is not a seller")

    orders = session.exec(
        select(Order).where(Order.sellerId == user.id)
    ).all()
    return orders


@app.put("/orders/{order_id}/status")
def update_order_status(
    order_id: str,
    status: str,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Update order status (seller only)"""
    if not user.isSeller:
        raise HTTPException(status_code=403, detail="User is not a seller")

    order = session.exec(
        select(Order).where(Order.id == order_id)
    ).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.sellerId != user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this order")

    order.status = status
    order.updatedAt = datetime.utcnow()
    session.add(order)
    session.commit()
    session.refresh(order)
    return order


# ============ ADDRESS ENDPOINTS ============

@app.get("/addresses")
def get_addresses(
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get user's addresses"""
    addresses = session.exec(
        select(Address).where(Address.userId == user.id)
    ).all()
    return addresses


@app.post("/addresses")
def create_address(
    name: str,
    street: str,
    city: str,
    state: str,
    zip_code: str,
    country: str,
    is_default: bool = False,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Create new address"""
    address = Address(
        id=str(uuid.uuid4()),
        userId=user.id,
        name=name,
        street=street,
        city=city,
        state=state,
        zipCode=zip_code,
        country=country,
        isDefault=is_default
    )
    session.add(address)
    session.commit()
    session.refresh(address)
    return address


@app.put("/addresses/{address_id}")
def update_address(
    address_id: str,
    name: str = None,
    street: str = None,
    city: str = None,
    state: str = None,
    zip_code: str = None,
    country: str = None,
    is_default: bool = None,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Update address"""
    address = session.exec(
        select(Address).where(Address.id == address_id)
    ).first()

    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    if address.userId != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    if name:
        address.name = name
    if street:
        address.street = street
    if city:
        address.city = city
    if state:
        address.state = state
    if zip_code:
        address.zipCode = zip_code
    if country:
        address.country = country
    if is_default is not None:
        address.isDefault = is_default

    session.add(address)
    session.commit()
    session.refresh(address)
    return address


@app.delete("/addresses/{address_id}")
def delete_address(
    address_id: str,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Delete address"""
    address = session.exec(
        select(Address).where(Address.id == address_id)
    ).first()

    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    if address.userId != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    session.delete(address)
    session.commit()
    return {"message": "Address deleted"}


# ============ WISHLIST ENDPOINTS ============

@app.get("/wishlist")
def get_wishlist(
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Get user's wishlist"""
    wishlist_items = session.exec(
        select(WishlistItem).where(WishlistItem.userId == user.id)
    ).all()

    result = []
    for item in wishlist_items:
        product = session.exec(
            select(Product).where(Product.id == item.productId)
        ).first()
        if product:
            result.append({
                "wishlistItemId": item.id,
                "product": product
            })
    return result


@app.post("/wishlist")
def add_to_wishlist(
    product_id: str,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Add product to wishlist"""
    product = session.exec(
        select(Product).where(Product.id == product_id)
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Check if already in wishlist
    existing = session.exec(
        select(WishlistItem).where(
            (WishlistItem.userId == user.id) & (WishlistItem.productId == product_id)
        )
    ).first()

    if existing:
        return {"message": "Product already in wishlist"}

    wishlist_item = WishlistItem(
        id=str(uuid.uuid4()),
        userId=user.id,
        productId=product_id
    )
    session.add(wishlist_item)
    session.commit()
    return {"message": "Product added to wishlist"}


@app.delete("/wishlist/{wishlist_item_id}")
def remove_from_wishlist(
    wishlist_item_id: str,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Remove product from wishlist"""
    wishlist_item = session.exec(
        select(WishlistItem).where(WishlistItem.id == wishlist_item_id)
    ).first()

    if not wishlist_item:
        raise HTTPException(status_code=404, detail="Wishlist item not found")
    if wishlist_item.userId != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    session.delete(wishlist_item)
    session.commit()
    return {"message": "Item removed from wishlist"}


# ============ PROFILE ENDPOINTS ============

@app.put("/profile")
def update_profile(
    name: str = None,
    image: str = None,
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Update user profile"""
    if name:
        user.name = name
    if image:
        user.image = image

    user.updatedAt = datetime.utcnow()
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@app.post("/seller/register")
def register_as_seller(
    user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """Register user as seller"""
    user.isSeller = True
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    