interface FoodProps {
  food: {
    id: number | string;
    name: string;
    image: string;
    label?: string;
    dessert?: string;
    quantity: number;
  };
  onDelete: (id: string | number) => void;
}

const FoodItem = ({ food, onDelete }: FoodProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
      <div className="flex gap-7">
        <div className="">
          <img src={food.image} alt={food.name} className="w-24" />
        </div>
        <div>
          <h3 className="font-bold text-lg">{food.name}</h3>
          <p className="text-gray-600">{food.label || food.dessert}</p>
          <p className="text-blue-600 font-semibold">{food.quantity}x</p>
        </div>
      </div>
      <div>
        <button className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">
          Edit
        </button>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded"
          onClick={() => onDelete(food.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default FoodItem;
