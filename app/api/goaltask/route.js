import { connectMongoDB } from "@lib/mongodb";
import Goal from "@models/goals";

export async function POST(request) {
  const { text, goalId } = await request.json();

  if (!goalId) {
    return Response.json({ message: "goalId is missing from the request" }, { status: 400 });
  }

  await connectMongoDB();

  try {
    // Find the goal by id
    const goal = await Goal.findById(goalId);

    // Check if the current user is an owner of the goal
    const userEmail = request.headers["x-user-email"];

    // Add the task to the goal's tasks array
    goal.tasks.push({
      goalId: goalId,
      text: text,
    });

    await goal.save();

    return Response.json({
      message: "Task created successfully",
      task: goal.tasks[goal.tasks.length - 1],
    });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Task creation failed" }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { cardId, taskId } = await request.json();
  console.log({ cardId, taskId });
  await connectMongoDB();

  try {
    // Find the card and remove the task from its tasks array
    const updatedCard = await Goal.findOneAndUpdate(
      { _id: cardId },
      { $pull: { tasks: { _id: taskId } } },
      { new: true }
    );

    return Response.json({ message: "Task deleted successfully", updatedCard });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Task deletion failed" }, { status: 500 });
  }
}
