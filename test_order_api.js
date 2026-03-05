async function testOrder() {
    try {
        const payload = {
            items: [
                { id: "cmmcgyi2w0001mz7mnh20fuwd", quantity: 1, price: 10, storeId: "cmmbgbwgh0001cm3fd7yr0azv" }
            ],
            totalPrice: 10,
            addressData: {
                name: "Test User",
                phone: "1234567890",
                street: "123 Test St",
                city: "Testville",
                email: "customer@example.com",
                state: "N/A",
                zip: "00000",
                country: "PK"
            },
            saveAddress: false,
            paymentMethod: "COD"
        };

        const res = await fetch('http://localhost:3000/api/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const text = await res.text();
        console.log("Status:", res.status);
        console.log("Response:", text);
    } catch (e) {
        console.error(e);
    }
}
testOrder();
