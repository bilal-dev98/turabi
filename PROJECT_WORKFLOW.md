# GoCart E-Commerce: Full Project Workflow & Architecture

This document provides a complete technical walkthrough of the GoCart e-commerce platform, detailing how the Admin Panel, Public Frontend, API routes, and Supabase database interact based on the current implementation.

---

## 1. Overall Architecture

The application is built using a modern full-stack Next.js architecture deployed with a Supabase PostgreSQL database.

*   **Frontend & Admin Panel:** Both built with Next.js App Router (`app/` directory). The public storefront is located in `app/(public)` and the admin dashboard in `app/admin`. React components are used for the UI, styled with Tailwind CSS. State management is handled by React hooks and Redux for global settings (like currency).
*   **API Routes:** Next.js Route Handlers (`app/api/`) act as the backend server. These routes handle all business logic, securely connect to the database, and return JSON responses to the client components.
*   **Database connection:** The application uses Prisma Client (`lib/prisma.js`) to connect directly to the Supabase PostgreSQL database. Currently, most critical routes use Prisma's raw SQL execution (`$queryRawUnsafe` / `$executeRawUnsafe`) with parameterized inputs to ensure robust type handling (especially for booleans) and to bypass PostgREST permission constraints.
*   **Data Flow Diagram (Admin → Supabase → API → Frontend):**
    1.  **Admin Action:** An administrator uses a visual form in the `app/admin/...` dashboard to create or modify data (e.g., adding a product or banner).
    2.  **API Call:** The admin component sends a POST/PATCH `fetch` request containing the JSON payload to the corresponding Next.js backend API (e.g., `/api/admin/banners/`).
    3.  **Database Write:** The Next.js API route receives the payload, validates it, and executes a Prisma raw SQL query to insert/update the record in the Supabase PostgreSQL database.
    4.  **Database Read:** A visitor opens the public storefront. A client component (e.g., `Banner.jsx` or `ShopProductCard`) mounts and triggers a GET `fetch` request to a public API endpoint (e.g., `/api/banners/active`).
    5.  **Frontend Render:** The API queries Supabase, returns the active data as JSON, and the React component updates its state to render the UI for the customer.

---

## 2. Product System Workflow

The product system handles the life cycle of items sold on the store.

*   **How a product is added from Admin:**
    The admin navigates to the "Add Product" page. They fill out a form detailing the product name, description, price, category, and upload images.
*   **Which API route handles it:**
    The frontend form submits this data to the `POST /api/products` (or corresponding admin product route).
*   **How it is saved in Supabase:**
    The API route processes the images (often storing URLs if uploaded to a storage bucket) and writes a new record into the `Product` table in Supabase via Prisma.
*   **How frontend displays products:**
    Pages like `app/(public)/shop/page.jsx` or home page sections call `GET /api/products` to fetch all product records. They map over the returned JSON array and render instances of the `ProductCard` component.
*   **Edit/Delete flow:**
    In the admin product list, clicking "Edit" populates the form with existing data, submitting a `PATCH` request to update specific fields. Clicking "Delete" sends a `DELETE` request to remove the record from the Supabase `Product` table entirely.

---

## 3. Banner System Workflow

The announcement banner system allows admins to display a customizable alert at the top of the storefront.

*   **How a banner is created:**
    On `app/admin/banners`, the admin either selects a pre-made template or creates a custom banner. They define the message, button action, coupon code, URL, and gradient colors. The form POSTs to `/api/admin/banners`, which inserts a new record into the `AnnouncementBanner` table with `isActive: false` (unless the "Activate immediately" checkbox is used).
*   **How activation works:**
    When the admin clicks "Activate" on a saved banner, a `PATCH` request is sent to `/api/admin/banners/[id]`. The backend safely ensures only one active banner exists by executing two parameterized raw SQL queries:
    1.  `UPDATE "AnnouncementBanner" SET "isActive" = $1` (sets all to `false`).
    2.  `UPDATE "AnnouncementBanner" SET "isActive" = $1 WHERE id = $2` (sets the chosen banner to `true`).
*   **How `/api/banners/active` works:**
    This public GET endpoint pulls all banners from the database using `$queryRawUnsafe`. It then filters the array in JavaScript to find the first one where `isActive` is true (handling various PostgreSQL boolean representations like `true`, `1`, or `'t'`). It returns just that single banner object structured as `{ success: true, data: {...} }`.
*   **How frontend renders active banner:**
    The `components/Banner.jsx` client component is imported in the main public `layout.jsx`. On mount, a `useEffect` triggers a `fetch` (with `cache: 'no-store'`) to the active banner API. If a banner is returned, it sets the state and renders the gradient bar across the top of the screen; if no active banner exists, it renders nothing (`return null`).

---

## 4. Order & Checkout Workflow

The checkout system processes customer details and finalizes purchases.

*   **Checkout form fields:**
    The checkout page (`app/(public)/checkout/page.jsx`) collects standard delivery information: First Name, Last Name, Email, Street Address, City, State, ZIP, and Phone.
*   **Payment method selection:**
    The user selects from a toggle group:
    1.  **COD (Cash on Delivery):** Requires no upfront payment details.
    2.  **Easypaisa & Jazzcash:** Selecting these options dynamically reveals a new required input field.
*   **Conditional number field logic:**
    If Easypaisa or Jazzcash is selected, the UI conditionally renders a specific phone number input field, requiring the user to provide the account number associated with that mobile wallet to proceed with placing the order.
*   **How order is stored in Supabase:**
    Upon clicking "Place Order", the cart data, aggregated total, shipping info, and selected payment method/account number are sent to `POST /api/order`. The backend constructs an order record and executes a database insertion into the `Order` table, storing the status as "ORDER_PLACED".
*   **How Admin sees selected payment method:**
    The admin visits `/admin/orders`. The order list fetches from `/api/admin/orders`. When viewing order details, the UI displays the `paymentMethod` (e.g., "Easypaisa") alongside the conditional account number and current fulfillment status.

---

## 5. Database Structure Overview

Powered by PostgreSQL locally hosted on Supabase, managed via Prisma schema.

### Tables & Important Columns

*   **`Product` Table**
    *   `id`: Primary identifier.
    *   `name`, `description`: Text descriptions.
    *   `price`: Numeric cost.
    *   `images`: Array of image URL strings.
    *   `category`: Classification text.
*   **`AnnouncementBanner` Table**
    *   `id`: Unique identifier (e.g., `ban...`).
    *   `message`: The display text.
    *   `buttonLabel`, `buttonAction`: Defines what the banner button does ('link', 'coupon', 'dismiss').
    *   `couponCode`, `linkUrl`: Conditional fields based on the action.
    *   `gradient`, `textColor`: UI styling fields for the frontend.
    *   `isActive`: Boolean determining if it is the current live banner.
*   **`Order` Table**
    *   `id`: Unique order identifier.
    *   `userId` / `guestInfo`: Link to the purchaser.
    *   `items`: JSON structure of the products purchased.
    *   `totalAmount`: Final numeric cost.
    *   `paymentMethod`: String enum (COD, Easypaisa, Jazzcash).
    *   `paymentAccount`: The conditional phone number provided for digital wallets.
    *   `status`: Current fulfillment stage (ORDER_PLACED, PROCESSING, SHIPPED, DELIVERED).
    *   `shippingAddress`: JSON structure of delivery details.

*(Note: Additional standard tables exist for Users, Categories, and HomePageSections).*

---

## 6. API Structure

A breakdown of the Next.js App Router API endpoints utilized to move data between the frontend and the database.

*   **/api/products**
    *   `GET`: Returns array of all available products for the shop.
    *   `POST`: Creates a new product (used by Admin).
*   **/api/banners/active**
    *   `GET`: Public endpoint. Fetches banners, filters for the active one, and returns a single banner object. Provides clear error messaging if none are active.
*   **/api/admin/banners**
    *   `GET`: Admin endpoint. Returns all created banners (both active and inactive) along with their creation dates.
    *   `POST`: Admin endpoint. Accepts banner payload, checks if 'autoActivate' is requested, and inserts a new banner record into the database.
*   **/api/admin/banners/[id]**
    *   `PATCH`: Admin endpoint. Used to toggle the `isActive` state (which automatically deactivates others) or apply text/color edits to an existing banner.
    *   `DELETE`: Admin endpoint. Removes a banner from the database. Includes fallback logic to automatically activate the next most recent banner if the currently active one is deleted.
*   **/api/order**
    *   `POST`: Public endpoint. Receives cart payload and customer details from checkout. Validates input and creates a new master order record.
*   **/api/admin/orders**
    *   `GET`: Admin endpoint. Fetches all orders.
*   **/api/admin/orders/[id]**
    *   `GET`: Admin endpoint. Fetches specific details of a single order.
    *   `PATCH`: Admin endpoint. Updates the status (e.g., from PROCESSING to SHIPPED).

All APIs are designed to return a consistent JSON structure: `{ success: boolean, data?: any, message?: string }`.

---

## 7. Frontend–Backend–Database Flow Diagram

A step-by-step example of how data moves through the system, using the Banner System as the scenario:

**Step 1. [Frontend Admin]** The administrator selects a "Warning" template on `/admin/banners`, modifying the text, and clicks "Create Banner" with "Activate immediately" checked.
**Step 2. [Network]** The React client dispatches an HTTP `POST` request to `http://localhost:3000/api/admin/banners` with a JSON body containing the text, colors, and the auto-activate flag.
**Step 3. [Backend API]** The Next.js Route Handler for the POST endpoint receives the payload. Because auto-activate is true, it temporarily pauses the insert operation.
**Step 4. [Database Write]** The API uses Prisma to send a raw SQL `UPDATE` command to Supabase: `SET "isActive" = false` for all rows.
**Step 5. [Database Write 2]** The API uses Prisma to send a second raw SQL `INSERT` command to Supabase, writing the new banner row with `isActive` set to `true`.
**Step 6. [Backend API]** Supabase confirms the write. The API returns a `200 OK` response with `{ success: true }` to the Admin Panel. The Admin UI shows a success toast.
**Step 7. [Frontend Public]** A customer visits the homepage. The `Banner.jsx` component mounts and executes a `fetch` request to `http://localhost:3000/api/banners/active`.
**Step 8. [Database Read]** The GET API route uses Prisma raw SQL to query Supabase for all banners. Supabase returns the array of rows.
**Step 9. [Backend API]** The API filters the array in memory to find the one where `isActive === true` (the warning banner just created) and sends it as JSON to the customer's browser.
**Step 10. [Frontend Public]** The `Banner.jsx` component receives the JSON data, updates its React state, and visually renders the Warning banner across the top of the browser window.
