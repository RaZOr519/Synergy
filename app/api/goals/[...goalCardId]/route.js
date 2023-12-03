import { connectMongoDB } from "@lib/mongodb";
import Goal from "@models/goals";

export async function DELETE(res, req) {
  //const { goalCardId } = request.params;
  let { goalCardId } = req.params;
  if (!goalCardId) {
    return Response.json({ message: "GoalId is missing from the request params" }, { status: 400 });
  }

  await connectMongoDB();

  try {
    const deletedGoal = await Goal.findByIdAndDelete(goalCardId);

    return Response.json({ message: "Goal deleted successfully", deletedGoal });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Goal deletion failed" }, { status: 500 });
  }
}
