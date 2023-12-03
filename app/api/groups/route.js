import { connectMongoDB } from "@lib/mongodb";
import Group from "@/models/group";

export async function GET(request) {
  await connectMongoDB();

  try {
    const groups = await Group.find();
    return Response.json({ groups });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Groups fetching failed" }, { status: 500 });
  }
}

export async function POST(request) {
  const { groupName, owner } = await request.json();

  await connectMongoDB();

  try {
    // Retrieve the user's email from the request headers
    const userEmail = request.headers["x-user-email"];

    // Create a new group with the user's email
    const group = await Group.create({ name: groupName, owner, createdBy: userEmail });
    return Response.json({ message: "Group created successfully", group });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Group creation failed" }, { status: 500 });
  }
}

export async function DELETE(request) {
  const { groupId } = await request.json();

  await connectMongoDB();

  try {
    // Retrieve the user's email from the request headers
    const userEmail = request.headers["x-user-email"];

    // Delete the group based on user's email and group ID
    const deletedGroup = await Group.findOneAndDelete({ _id: groupId, createdBy: userEmail });

    if (deletedGroup) {
      return Response.json({ message: "Group deleted successfully" });
    } else {
      return Response.json(
        { message: "Group not found or you don't have permission" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}