from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime
from sqlalchemy import Column, JSON

# Define models that match Better Auth's schema
class User(SQLModel, table=True):
    __tablename__ = "user"
    id: str = Field(primary_key=True)
    name: str
    email: str
    emailVerified: bool
    image: Optional[str] = None
    password: Optional[str] = None  # Hashed password (added for custom auth)
    createdAt: datetime
    updatedAt: datetime
    isBuyer: bool = Field(default=True)  # Can purchase products
    isSeller: bool = Field(default=False)  # Can sell products
    sellerVerified: bool = Field(default=False)  # Seller verification status

class Session(SQLModel, table=True):
    __tablename__ = "session"
    id: str = Field(primary_key=True)
    userId: str = Field(foreign_key="user.id")
    token: str
    expiresAt: datetime
    ipAddress: Optional[str] = None
    userAgent: Optional[str] = None


class Product(SQLModel, table=True):
    __tablename__ = "product"
    id: str = Field(primary_key=True)
    sellerId: str = Field(foreign_key="user.id")
    name: str
    description: str
    category: str  # e.g., "fish", "shrimp", "crab", "shellfish"
    price: float
    unit: str  # e.g., "kg", "lb", "piece"
    stock: int
    freshness: str  # e.g., "fresh", "frozen"
    images: Optional[str] = None  # JSON array stored as string
    isActive: bool = True
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)


class CartItem(SQLModel, table=True):
    __tablename__ = "cart_item"
    id: str = Field(primary_key=True)
    userId: str = Field(foreign_key="user.id")
    productId: str = Field(foreign_key="product.id")
    quantity: int
    addedAt: datetime = Field(default_factory=datetime.utcnow)


class Order(SQLModel, table=True):
    __tablename__ = "order"
    id: str = Field(primary_key=True)
    buyerId: str = Field(foreign_key="user.id")
    sellerId: str = Field(foreign_key="user.id")
    status: str  # "pending", "confirmed", "shipped", "delivered", "cancelled"
    totalPrice: float
    shippingAddress: Optional[str] = None  # JSON stored as string
    paymentMethod: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)


class OrderItem(SQLModel, table=True):
    __tablename__ = "order_item"
    id: str = Field(primary_key=True)
    orderId: str = Field(foreign_key="order.id")
    productId: str = Field(foreign_key="product.id")
    quantity: int
    priceAtPurchase: float


class Address(SQLModel, table=True):
    __tablename__ = "address"
    id: str = Field(primary_key=True)
    userId: str = Field(foreign_key="user.id")
    name: str
    street: str
    city: str
    state: str
    zipCode: str
    country: str
    isDefault: bool = False
    createdAt: datetime = Field(default_factory=datetime.utcnow)


class WishlistItem(SQLModel, table=True):
    __tablename__ = "wishlist_item"
    id: str = Field(primary_key=True)
    userId: str = Field(foreign_key="user.id")
    productId: str = Field(foreign_key="product.id")
    addedAt: datetime = Field(default_factory=datetime.utcnow)
