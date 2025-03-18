interface FinalReviewProps {
    formData: {
      maid: { name: string; cuisine: string; rating: number } | null;
      cuisine: string | null;
      members: string[] | null; // ✅ Fixed: members should be an array
      time: string | null;
      confirmedFoods: string[]; // ✅ Added confirmedFoods
    };
  }
  
  const FinalReview: React.FC<FinalReviewProps> = ({ formData }) => {
    return (
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Final Review</h2>
  
        <ul className="text-gray-700">
          <li><strong>Maid:</strong> {formData.maid ? formData.maid.name : "Not Selected"}</li>
          <li><strong>Cuisine:</strong> {formData.cuisine || "Not Selected"}</li>
          <li><strong>Members:</strong> {formData.members?.join(", ") || "Not Selected"}</li>
          <li><strong>Time:</strong> {formData.time || "Not Selected"}</li>
        </ul>
  
        {/* ✅ Display Confirmed Foods */}
        {formData.confirmedFoods.length > 0 && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-100">
            <h3 className="text-lg font-semibold">Confirmed Foods</h3>
            <ul className="list-disc pl-5">
              {formData.confirmedFoods.map((food) => (
                <li key={food}>{food}</li>
              ))}
            </ul>
          </div>
        )}
  
        <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg">
          Proceed to Payment
        </button>
      </div>
    );
  };
  
  export default FinalReview;
  