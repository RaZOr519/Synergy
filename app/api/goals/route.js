// app/api/goals.js
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
  const { goalId } = request.params;
  const { text } = await request.json();

  if (!goalId || !text) {
    return Response.json(
      { message: "GoalId or text is missing from the request params" },
      { status: 400 }
    );
  }

  await connectMongoDB();

  try {
    const updatedGoal = await Goal.findByIdAndUpdate(
      goalId,
      { $push: { tasks: { text } } },
      { new: true }
    );

    return Response.json({
      message: "Checklist item added successfully",
      updatedGoal,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Failed to add checklist item to the database" },
      { status: 500 }
    );
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
