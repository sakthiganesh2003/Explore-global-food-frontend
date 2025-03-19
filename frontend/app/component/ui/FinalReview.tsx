interface FinalReviewProps {
  formData: {
    maid: { name: string; cuisine: string; rating: number } | null;
    cuisine: string | null;
    members: { name: string; dietary: string; allergies: string; specialRequest: string; quantity: number }[]; 
    time: string | null;
    confirmedFoods: string[];
  };
}

const FinalReview: React.FC<FinalReviewProps> = ({ formData }) => {
  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Final Review</h2>

      <ul className="text-gray-700">
        <li><strong>Maid:</strong> {formData.maid ? formData.maid.name : "Not Selected"}</li>
        <li><strong>Cuisine:</strong> {formData.confirmedFoods || "Not Selected"}</li>
        <li><strong>Time:</strong> {formData.time || "Not Selected"}</li>
      </ul>

      {/* Display Members */}
      {formData.members.length > 0 ? (
        <div className="mt-4 p-4 border rounded-lg bg-gray-100">
          <h3 className="text-lg font-semibold text-gray-700">Members</h3>
          <ul className="list-disc pl-5 text-gray-700">
            {formData.members.map((member, index) => (
              <li key={index}>
                <strong>{member.name}</strong> - {member.dietary}, {member.allergies ? `Allergies: ${member.allergies}` : 'No allergies'}, {member.specialRequest ? `Special Request: ${member.specialRequest}` : 'No special request'} (Quantity: {member.quantity})
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4 text-gray-600">No members added.</p>
      )}

      {/* Display Confirmed Foods */}
      {formData.confirmedFoods.length > 0 ? (
        <div className="mt-4 p-4 border rounded-lg bg-gray-100">
          <h3 className="text-lg font-semibold text-gray-700">Confirmed Foods</h3>
          <ul className="list-disc pl-5 text-gray-700">
            {formData.confirmedFoods.map((food, index) => (
              <li key={index}>{food}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-4 text-gray-600">No foods selected.</p>
      )}

      <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
        Proceed to Payment
      </button>
    </div>
  );
};

export default FinalReview;
