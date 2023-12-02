import User from "@/models/user";
import { connectMongoDB } from "@lib/mongodb";

export async function POST(request) {
	const { name, email } = await request.json();
	await connectMongoDB();
	await User.create({ name, email });
	return Response.json(
		{ message: "User created successfully" },
		{ status: 201 }
	);
}
