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

//write function to update owners list
export async function PUT(request) {
  const { owner, groupId } = await request.json();

  if (!groupId) {
    return Response.json(
      { message: "groupId is missing from the request params" },
      { status: 400 }
    );
  }

  await connectMongoDB();

  try {
    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { $addToSet: { owners: owner } },
      { new: true }
    );

    console.log(owner, groupId, updatedGroup);

    return Response.json({ message: "Group owners updated successfully", updatedGroup });
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Group owners update failed" }, { status: 500 });
  }
}

export async function POST(request) {
  const { groupName } = await request.json();

  await connectMongoDB();

  try {
    // Retrieve the user's email from the request headers
    const userEmail = request.headers["x-user-email"];

    let exitingOwners = [];
    // Create a new group with the user's email and additional owners
    const group = await Group.create({
      name: groupName,
      owners: [...exitingOwners, userEmail],
      createdBy: userEmail,
    });

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
