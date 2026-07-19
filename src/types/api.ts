// ─────────────────────────────────────────────────────────
// Vedil Clothing — Frontend ↔ Backend API Contract (Types)
// ─────────────────────────────────────────────────────────
// These types define the EXACT shapes the frontend expects
// from the backend API. They are the typed contract.
//
// When the backend changes a response shape, update here.
// If the backend CANNOT deliver what's defined, that's a
// discrepancy to capture in docs/api-contract.md.
// ─────────────────────────────────────────────────────────

// ─── Meta ─────────────────────────────────────────────────

export interface ApiMetadata {
	service: string;
	version: string;
	environment: string;
	status: "healthy";
	documentationUrl: string;
	timestamp: string;
}

export interface HealthResponse {
	status: "ok";
	timestamp: string;
}

// ─── Products (Physical) ──────────────────────────────────

export interface ApiFile {
	id: string;
	url: string;
	altText: string | null;
	width: number | null;
	height: number | null;
	mimeType: string | null;
	sizeInBytes: number | null;
}

export interface ApiProductImage {
	id: string;
	displayOrder: number;
	isPrimary: boolean;
	file: ApiFile;
}

export interface ApiPriceTier {
	id: string;
	minQuantity: number;
	amount: number; // kobo (minor currency unit)
	currencyCode: string;
}

export interface ApiOptionType {
	id: string;
	name: string; // e.g. "Size", "Color"
	slug: string;
	displayOrder: number;
}

export interface ApiOptionValue {
	id: string;
	value: string; // e.g. "XL"
	code: string | null;
	displayOrder: number;
	optionType: ApiOptionType;
}

export interface ApiVariantOptionValue {
	optionValueId: string;
	optionValue: ApiOptionValue;
}

export interface ApiVariantImage {
	id: string;
	displayOrder: number;
	isPrimary: boolean;
	file: ApiFile;
}

export interface ApiVariant {
	id: string;
	productId: string;
	sku: string;
	status: "ACTIVE" | "OUT_OF_STOCK" | "DISCONTINUED";
	isDefault: boolean;
	priceTiers: ApiPriceTier[];
	optionValues: ApiVariantOptionValue[];
	images: ApiVariantImage[];
	createdAt: string;
	updatedAt: string;
}

export interface ApiProductAttribute {
	id: string;
	name: string;
	value: string;
	displayOrder: number | null;
}

export interface ApiCategory {
	id: string;
	name: string;
	slug: string;
}

export type ProductKind = "PHYSICAL" | "COURSE";
export type ProductStatus = "DRAFT" | "ACTIVE" | "ARCHIVED" | "DISCONTINUED";

export interface ApiProductListItem {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	status: ProductStatus;
	kind: ProductKind;
	gender: "WOMEN" | "MEN" | "CHILDREN" | "UNISEX" | null;
	featured: boolean;
	isNew: boolean;
	moq: number;
	categoryId: string;
	category: ApiCategory;
	images: ApiProductImage[];
	variants: ApiVariant[];
	createdAt: string;
	updatedAt: string;
}

export type ApiProductListResponse = ApiProductListItem[];

export interface ApiProductDetail extends ApiProductListItem {
	attributes: ApiProductAttribute[];
}

// ─── Courses ──────────────────────────────────────────────

export type DeliveryMode = "SELF_PACED" | "LIVE" | "HYBRID";

export interface ApiCourseProfile {
	id: string;
	instructorName: string;
	durationText: string;
	deliveryMode: DeliveryMode;
	accessDurationDays: number | null;
	startsAt: string | null;
	endsAt: string | null;
}

export interface ApiCourseListItem {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	status: ProductStatus;
	kind: "COURSE";
	categoryId: string;
	courseProfile: ApiCourseProfile;
	images: ApiProductImage[];
	variants: ApiVariant[];
	createdAt: string;
	updatedAt: string;
}

export type ApiCourseListResponse = ApiCourseListItem[];

// Product detail response for courses is same shape as list
export type ApiCourseDetail = ApiCourseListItem;

// ─── Company Profile ─────────────────────────────────────

export interface ApiCompanyProfile {
	id: string;
	phone: string;
	whatsapp: string;
	email: string;
	addressLine: string;
	city: string;
	state: string;
	country: string;
	instagramUrl: string;
	facebookUrl: string;
	tiktokUrl: string;
}

// ─── Site Config ─────────────────────────────────────────

export interface ApiSiteConfig {
	id: string;
	currencyCode: string;
	localDeliveryFee: number; // kobo
	intlDeliveryFee: number; // kobo
	moqDefault: number;
}

// ─── Cart ────────────────────────────────────────────────

export interface ApiCartItem {
	id: string;
	variantId: string;
	quantity: number;
	unitPrice: number; // kobo
	lineTotal: number; // kobo
}

export interface ApiCart {
	id: string;
	cartSessionId: string | null;
	userId: string | null;
	items: ApiCartItem[];
	total: number; // kobo
	createdAt: string;
	updatedAt: string;
}

export interface AddToCartPayload {
	variantId: string;
	quantity: number;
}

export interface UpdateCartItemPayload {
	quantity: number;
}

// ─── Address ─────────────────────────────────────────────

export interface ApiAddress {
	street: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
}

// ─── Checkout ────────────────────────────────────────────

export interface InitiateCheckoutPayload {
	cartSessionId: string;
	customerEmail: string;
	customerPhone?: string;
	shippingAddress?: ApiAddress;
	deliveryFeeAmount?: number; // kobo
	currencyCode?: string; // default: NGN
	emailVerificationToken?: string; // required for course items
}

export interface CheckoutResponse {
	orderId: string;
	orderReference: string;
	totalAmount: number; // kobo
	authorizationUrl: string; // Paystack redirect URL
	accessCode: string;
	paystackReference: string;
}

// ─── Orders ──────────────────────────────────────────────

export type OrderStatus = "PENDING_PAYMENT" | "PAID" | "CANCELED" | "FAILED";

export interface ApiOrderItem {
	id: string;
	variantId: string;
	productNameSnapshot: string;
	variantSkuSnapshot: string;
	productKindSnapshot: ProductKind;
	unitAmountSnapshot: number;
	quantity: number;
	lineAmountSnapshot: number;
	currencyCode: string;
	selectedOptionsSnapshot: Record<string, string> | null;
}

export interface ApiOrder {
	id: string;
	orderReference: string;
	status: OrderStatus;
	currencyCode: string;
	subtotalAmount: number;
	deliveryFeeAmount: number;
	totalAmount: number;
	customerEmail: string;
	customerPhone: string | null;
	shippingAddress: ApiAddress | null;
	paystackReference: string | null;
	items: ApiOrderItem[];
	createdAt: string;
	updatedAt: string;
}

// ─── Checkout Status ─────────────────────────────────────

export type PaymentStatus = "PENDING_PAYMENT" | "PAID" | "CANCELED" | "FAILED";

export interface CheckoutStatusResponse {
	orderReference: string;
	status: PaymentStatus;
	paystackReference: string | null;
	totalAmount: number;
	currencyCode: string;
}

// ─── Email Verification ─────────────────────────────────

export interface SendOtpPayload {
	email: string;
}

export interface VerifyOtpPayload {
	email: string;
	otp: string; // 6-digit code
}

export interface VerifyOtpResponse {
	// Returns a verificationToken (string) in the response body
	verificationToken: string;
}

// ─── Contact Inquiries ──────────────────────────────────

export interface CreateContactInquiryPayload {
	name: string;
	phone?: string;
	email?: string;
	subject: string; // order | academy | factory | wholesale | other
	message: string;
}

export interface ContactInquiryResponse {
	id: string;
	// Full created inquiry details
	name: string;
	phone: string;
	email: string;
	subject: string;
	message: string;
}

// ─── Factory Inquiries ──────────────────────────────────

export type FactoryService = "BULK" | "CUSTOM" | "WHOLESALE";

export interface CreateFactoryInquiryPayload {
	name: string;
	phone: string;
	email: string;
	service: FactoryService;
	details: string;
	files?: File[]; // multipart upload, max 5 files, 20MB each
}

export interface FactoryInquiryResponse {
	id: string;
	name: string;
	phone: string;
	email: string;
	service: FactoryService;
	details: string;
}
