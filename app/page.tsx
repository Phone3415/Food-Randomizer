import { getFoodsAction } from "./actions";
import { FoodAppClient } from "../components/FoodAppClient";
import { Footer } from "../components/Footer";

// Revalidate page and front-end cache every 2 minutes (120 seconds)
export const revalidate = 120;

export default async function HomePage() {
  const { foods, categories, rateLimit } = await getFoodsAction();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 px-4 py-8 sm:py-12 flex flex-col justify-between transition-colors">
      <div className="flex-1">
        <FoodAppClient
          initialFoods={foods}
          initialCategories={categories}
          initialRateLimit={rateLimit}
        />
      </div>

      {/* Polish & Decoupled Footer */}
      <Footer />
    </div>
  );
}

