'use client'
import { useState, useEffect } from "react";
import BestSelling from "@/components/BestSelling";
import Hero from "@/components/Hero";
import Newsletter from "@/components/Newsletter";
import OurSpecs from "@/components/OurSpec";
import LatestProducts from "@/components/LatestProducts";

export default function Home() {
    const [sections, setSections] = useState(null);

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const res = await fetch('/api/homepage-sections');
                const data = await res.json();
                if (data.success) {
                    setSections(data.data);
                }
            } catch (error) {
                console.error("Failed to fetch home sections:", error);
            }
        };
        fetchSections();
    }, []);

    const latestProductsSection = sections?.find(s => s.identifier === 'latest_products');
    const bestSellingSection = sections?.find(s => s.identifier === 'best_selling');
    const ourSpecsSection = sections?.find(s => s.identifier === 'our_specs');

    return (
        <div>
            <Hero />
            <LatestProducts sectionData={latestProductsSection} />
            <BestSelling sectionData={bestSellingSection} />
            <OurSpecs sectionData={ourSpecsSection} />
            <Newsletter />
        </div>
    );
}
