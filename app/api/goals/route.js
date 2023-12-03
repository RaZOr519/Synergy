import { connectMongoDB } from "@lib/mongodb";
import Goal from "@models/goals";

export async function GET(request) {
  await connectMongoDB();

  try {
    const goals = await Goal.find();
    return Response.json({ goals });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Error fetching goals" }, { status: 500 });
  }
}
export async function POST(request) {
  // Ensure title is present in request bodzxzzxz
  const { title, tasks, newTask, newTaskDeadline, owner, completed } = await request.json();

  // Check if title is undefined
  if (!title) {
    return Response.json({ message: "Title is missing from the request" }, { status: 400 });
  }

  await connectMongoDB();

  try {
    const goal = new Goal({
      title,
      tasks: tasks || [],
      newTask: newTask || "",
      newTaskDeadline: newTaskDeadline || "",
      completed: completed || false,
      owner: owner,
    });

    await goal.save();

    return Response.json({ message: "Goal created successfully", goal });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Goal creation failed" }, { status: 500 });
  }
}

export async function PUT(request) {
  const { goalId } = request.params;
  const { tasks } = await request.json();

  if (!goalId) {
    return Response.json({ message: "GoalId is missing from the request params" }, { status: 400 });
  }

  await connectMongoDB();

  try {
    const updatedGoal = await Goal.findByIdAndUpdate(goalId, { $set: { tasks } }, { new: true });

    return Response.json({ message: "Goal tasks updated successfully", updatedGoal });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Goal tasks update failed" }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { goalId } = request.params;

  if (!goalId) {
    return Response.json({ message: "GoalId is missing from the request params" }, { status: 400 });
  }

  await connectMongoDB();

  try {
    const deletedGoal = await Goal.findByIdAndDelete(goalId);

    return Response.json({ message: "Goal deleted successfully", deletedGoal });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Goal deletion failed" }, { status: 500 });
  }
}

export async function PUT_COMPLETE(request) {
  const { goalId } = request.params;
  const { completed } = await request.json();

  if (!goalId) {
    return Response.json({ message: "GoalId is missing from the request params" }, { status: 400 });
  }

  await connectMongoDB();

  try {
    const updatedGoal = await Goal.findByIdAndUpdate(
      goalId,
      { $set: { completed } },
      { new: true }
    );

    return Response.json({ message: "Goal completion status updated successfully", updatedGoal });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Goal completion status update failed" }, { status: 500 });
  }
}
