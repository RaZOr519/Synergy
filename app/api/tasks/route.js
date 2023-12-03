import { connectMongoDB } from "@lib/mongodb";
import Group from "@models/group";

export async function POST(request) {
  const { cardId, text, deadline, groupId } = await request.json();

  if (!groupId) {
    return Response.json({ message: "groupId is missing from the request" }, { status: 400 });
  }

  await connectMongoDB();

  try {
    // Find the group by id
    const group = await Group.findById(groupId);

    // Check if the current user is an owner of the group
    const userEmail = request.headers["x-user-email"];
    if (!group.owners.includes(userEmail)) {
      return Response.json(
        { message: "You don't have permission to create a task in this group" },
        { status: 403 }
      );
    }

    // Add the task to the group's tasks array
    group.tasks.push({
      cardId: cardId,
      text: text,
      deadline: deadline,
    });

    await group.save();

    return Response.json({
      message: "Task created successfully",
      task: group.tasks[group.tasks.length - 1],
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
    const updatedCard = await Group.findOneAndUpdate(
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
