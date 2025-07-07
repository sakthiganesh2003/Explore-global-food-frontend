"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import Sidebar from '@/app/component/dashboard/Sidebar';
import { Card, Statistic, Table, Tag, Image, Button, Spin, Divider, Typography, Empty } from 'antd';
import { 
  DeleteOutlined, 
  FileImageOutlined, 
  VideoCameraOutlined, 
  ClockCircleOutlined, 
  FireOutlined, 
  TeamOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;

interface Media {
  url: string;
  public_id: string;
  media_type: 'image' | 'video';
  width: number;
  height: number;
  format: string;
  duration?: number;
}

interface Recipe {
  _id: string;
  recipe_name: string;
  category_type: string;
  instructions: string;
  cuisine_type: string;
  ingredients: string[];
  prep_time: string;
  cook_time: string;
  servings: string;
  date_time: string;
  created_at: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  media: Media;
}

interface ApiResponse {
  success: boolean;
  count: number;
  page: number;
  pages: number;
  total: number;
  data: Recipe[];
}

export default function AdminDashboard() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [categoryBreakdown, setCategoryBreakdown] = useState<{ [key: string]: number }>({});
  const [mediaBreakdown, setMediaBreakdown] = useState<{ image: number; video: number }>({ image: 0, video: 0 });

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ApiResponse>(`${process.env.NEXT_PUBLIC_API_URL}/api/chefposts`);
        if (response.data.success) {
          const fetchedRecipes = response.data.data;
          setRecipes(fetchedRecipes);
          setTotalPosts(response.data.total);

          // Calculate category breakdown
          const categories = fetchedRecipes.reduce((acc, recipe) => {
            acc[recipe.category_type] = (acc[recipe.category_type] || 0) + 1;
            return acc;
          }, {} as { [key: string]: number });
          setCategoryBreakdown(categories);

          // Calculate media type breakdown
          const mediaCounts = fetchedRecipes.reduce(
            (acc, recipe) => {
              if (recipe.media.media_type === 'image') acc.image += 1;
              else if (recipe.media.media_type === 'video') acc.video += 1;
              return acc;
            },
            { image: 0, video: 0 }
          );
          setMediaBreakdown(mediaCounts);
        } else {
          setError('Failed to fetch recipes');
        }
      } catch (err) {
        setError('Error fetching data: ' + (err instanceof Error ? err.message : 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    try {
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/chefposts/${id}`);
      const data = response.data as { success: boolean };
      if (data.success) {
        setRecipes((prevRecipes) => {
          const deletedRecipe = prevRecipes.find((recipe) => recipe._id === id);
          if (deletedRecipe) {
            setCategoryBreakdown((prev) => {
              const newBreakdown = { ...prev };
              newBreakdown[deletedRecipe.category_type] = (newBreakdown[deletedRecipe.category_type] || 1) - 1;
              if (newBreakdown[deletedRecipe.category_type] === 0) delete newBreakdown[deletedRecipe.category_type];
              return newBreakdown;
            });

            setMediaBreakdown((prev) => ({
              ...prev,
              [deletedRecipe.media.media_type]: prev[deletedRecipe.media.media_type as 'image' | 'video'] - 1,
            }));
          }
          return prevRecipes.filter((recipe) => recipe._id !== id);
        });
        setTotalPosts((prev) => prev - 1);
      } else {
        setError('Failed to delete recipe');
      }
    } catch (err) {
      setError('Error deleting recipe: ' + (err instanceof Error ? err.message : 'Unknown error'));
    }
  };

  const columns = [
    {
      title: 'Recipe',
      dataIndex: 'recipe_name',
      key: 'recipe_name',
      render: (text: string, record: Recipe) => (
        <div className="flex items-center">
          {record.media.media_type === 'image' ? (
            <Image
              src={record.media.url}
              alt={text}
              width={60}
              height={60}
              className="rounded-md object-cover"
              preview={false}
            />
          ) : (
            <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center">
              <VideoCameraOutlined className="text-xl" />
            </div>
          )}
          <span className="ml-3 font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category_type',
      key: 'category_type',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Cuisine',
      dataIndex: 'cuisine_type',
      key: 'cuisine_type',
      render: (text: string) => <Tag color="green">{text}</Tag>,
    },
    {
      title: 'Ingredients',
      dataIndex: 'ingredients',
      key: 'ingredients',
      render: (ingredients: string[]) => (
        <div className="max-w-xs">
          <Text ellipsis={{ tooltip: ingredients.join(', ') }}>
            {ingredients.slice(0, 3).join(', ')}
            {ingredients.length > 3 ? '...' : ''}
          </Text>
        </div>
      ),
    },
    {
      title: 'Time',
      key: 'time',
      render: (record: Recipe) => (
        <div>
          <div className="flex items-center">
            <ClockCircleOutlined className="mr-1" />
            <span>Prep: {record.prep_time}m</span>
          </div>
          <div className="flex items-center">
            <FireOutlined className="mr-1" />
            <span>Cook: {record.cook_time}m</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Servings',
      dataIndex: 'servings',
      key: 'servings',
      render: (text: string) => (
        <div className="flex items-center">
          <TeamOutlined className="mr-1" />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Recipe) => (
        <Button
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(record._id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Head>
          <title> Recipes</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>

        <div className="bg-white p-6 shadow-sm">
          <Title level={3} className="mb-0 text-3xl font-bold text-gray-800">Recipe Management</Title>
          <Text type="secondary">Manage all recipes posted by chefs</Text>
        </div>

        <div className="p-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <Statistic
                title="Total Recipes"
                value={totalPosts}
                prefix={<FileImageOutlined />}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
            <Card>
              <Statistic
                title="Images"
                value={mediaBreakdown.image}
                prefix={<FileImageOutlined />}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
            <Card>
              <Statistic
                title="Videos"
                value={mediaBreakdown.video}
                prefix={<VideoCameraOutlined />}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </div>

          {/* Category Tags */}
          <Card title="Categories" className="mb-6">
            <div className="flex flex-wrap gap-2">
              {Object.entries(categoryBreakdown).map(([category, count]) => (
                <Tag key={category} color="geekblue" className="text-sm py-1 px-3">
                  {category}: {count}
                </Tag>
              ))}
            </div>
          </Card>

          <Divider />

          {/* Recipes Table */}
          <Card title="All Recipes" className="shadow-sm">
            {loading ? (
              <div className="text-center py-12">
                <Spin size="large" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <Text type="danger">{error}</Text>
              </div>
            ) : recipes.length === 0 ? (
              <Empty description="No recipes found" />
            ) : (
              <Table
                columns={columns}
                dataSource={recipes}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: true }}
                className="rounded-md overflow-hidden"
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}