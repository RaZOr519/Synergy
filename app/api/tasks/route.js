import { connectMongoDB } from "@lib/mongodb";
import Group from "@models/group";

export async function POST(request) {
  // Ensure groupId is present in request.query

  const { cardId, text, deadline, groupId } = await request.json();
  console.log({ cardId, text, deadline, groupId });
  //const groupId = request.query?.groupId;

  // Check if groupId is undefined
  if (groupId === undefined) {
    return Response.json({ message: "groupId is missing from the request" }, { status: 400 });
  }

  await connectMongoDB();

  try {
    //find group by id
    const group = await Group.findById(groupId);
    console.log(group);
    group.tasks.push({
      groupId: groupId,
      cardId: groupId,
      text: text,
      deadline: deadline,
    });
    await group.save();

    return Response.json({ message: "Task created successfully", task });
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
