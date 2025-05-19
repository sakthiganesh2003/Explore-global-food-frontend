// app/chef/recipespost/[id]/page.tsx
import { notFound } from 'next/navigation';
import Head from 'next/head';
import Navbar from '@/app/component/navbar';
import Footer from '@/app/component/Footer';

// Define TypeScript interface for Recipe
interface Recipe {
  _id: string;
  recipe_name: string;
  media?: {
    url: string;
    public_id?: string;
    media_type: string; // e.g., "video" or "image"
    width?: number;
    height?: number;
    format?: string;
  };
  category_type: string;
  cuisine_type: string;
  ingredients: string[];
  instructions: string;
  prep_time: string;
  cook_time: string;
  servings: string;
  date_time: string;
  created_at: string;
  updated_at: string;
}

async function getRecipe(id: string): Promise<Recipe | null> {
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
    return null;
  }

  if (!process.env.NEXT_PUBLIC_API_URL) {
    console.error('NEXT_PUBLIC_API_URL is not defined');
    return null;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chefposts/${id}`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chefposts`);
    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    return data.success
      ? data.data
          .filter((recipe: Recipe) => recipe._id && /^[0-9a-fA-F]{24}$/.test(recipe._id))
          .map((recipe: Recipe) => ({ id: recipe._id }))
      : [];
  } catch (error) {
    return [];
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RecipePage({ params }: PageProps) {
  const { id } = await params; // Await params to resolve the Promise
  const recipe = await getRecipe(id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      < Navbar/>
      <Head>
        <title>{recipe.recipe_name || 'Recipe'} | Food App</title>
        <meta name="description" content={`Recipe for ${recipe.recipe_name || 'unknown'}`} />
      </Head>

      <main className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="relative h-64 sm:h-80">
            {/* Conditionally render image, video, or placeholder */}
            {recipe.media ? (
              recipe.media.media_type === 'video' ? (
                <video
                  src={recipe.media.url}
                  controls
                  className="w-full h-full object-cover"
                  aria-label={`Video for ${recipe.recipe_name}`}
                />
              ) : (
                <img
                  src={recipe.media.url || '/placeholder.png'}
                  alt={recipe.recipe_name || 'Recipe'}
                  className="w-full h-full object-cover"
                />
              )
            ) : (
              <img
                src="/placeholder.png"
                alt="No media available"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">{recipe.recipe_name}</h1>
            <div className="flex gap-2 mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {recipe.category_type || 'Unknown'}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                {recipe.cuisine_type || 'Unknown'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-2 bg-gray-100 rounded-lg">
                <div className="text-gray-500">Prep Time</div>
                <div className="font-bold">{recipe.prep_time ? `${recipe.prep_time} min` : 'N/A'}</div>
              </div>
              <div className="text-center p-2 bg-gray-100 rounded-lg">
                <div className="text-gray-500">Cook Time</div>
                <div className="font-bold">{recipe.cook_time ? `${recipe.cook_time} min` : 'N/A'}</div>
              </div>
              <div className="text-center p-2 bg-gray-100 rounded-lg">
                <div className="text-gray-500">Servings</div>
                <div className="font-bold">{recipe.servings || 'N/A'}</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
                <ul className="space-y-2">
                  {(recipe.ingredients || []).map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="inline-block w-4 h-4 bg-yellow-400 rounded-full mt-1 mr-2"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                  {(!recipe.ingredients || recipe.ingredients.length === 0) && (
                    <li className="text-gray-500">No ingredients listed</li>
                  )}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Instructions</h2>
                <div className="whitespace-pre-line">{recipe.instructions || 'No instructions provided'}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      < Footer/>
    </div>
  );
}