"use client";
import { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

interface Recipe {
  _id: string;
  recipe_name: string;
  media: { url: string };
  category_type: string;
  cuisine_type: string;
  ingredients: string[];
  instructions: string;
  prep_time: string;
  cook_time: string;
  servings: string;
}

interface Props {
  recipe: Recipe;
}

const RecipePage: NextPage<Props> = ({ recipe }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{recipe.recipe_name} | Food App</title>
      </Head>

      <main className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Recipe Header */}
          <div className="relative h-64 sm:h-80">
            <img
              src={recipe.media.url}
              alt={recipe.recipe_name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6">
            <h1 className="text-3xl font-bold mb-2">{recipe.recipe_name}</h1>
            <div className="flex gap-2 mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {recipe.category_type}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                {recipe.cuisine_type}
              </span>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-2 bg-gray-100 rounded-lg">
                <div className="text-gray-500">Prep Time</div>
                <div className="font-bold">{recipe.prep_time} min</div>
              </div>
              <div className="text-center p-2 bg-gray-100 rounded-lg">
                <div className="text-gray-500">Cook Time</div>
                <div className="font-bold">{recipe.cook_time} min</div>
              </div>
              <div className="text-center p-2 bg-gray-100 rounded-lg">
                <div className="text-gray-500">Servings</div>
                <div className="font-bold">{recipe.servings}</div>
              </div>
            </div>

            {/* Ingredients & Instructions */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">Ingredients</h2>
                <ul className="space-y-2">
                  {recipe.ingredients.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="inline-block w-4 h-4 bg-yellow-400 rounded-full mt-1 mr-2"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Instructions</h2>
                <div className="whitespace-pre-line">{recipe.instructions}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chefposts`);
  const data = await res.json();

  const paths = data.data.map((recipe: Recipe) => ({
    params: { id: recipe._id },
  }));

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chefposts/${params?.id}`);
  const data = await res.json();

  if (!data.success || data.count === 0) {
    return { notFound: true };
  }

  return {
    props: {
      recipe: data.data[0],
    },
    revalidate: 60,
  };
};

export default RecipePage;