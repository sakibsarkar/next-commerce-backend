import prisma from "../app/config/prisma";

export async function deleteSuspendedUsers() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    // Find and delete users meeting the criteria
    const usersToDelete = await prisma.user.findMany({
      where: {
        isSuspended: true,
        isDeleted: false,
        suspensionDate: {
          lte: thirtyDaysAgo,
        },
      },
    });

    if (usersToDelete.length > 0) {
      // Delete the users
      await prisma.user.deleteMany({
        where: {
          id: { in: usersToDelete.map((user) => user.id) },
        },
      });

      console.log(`${usersToDelete.length} user(s) deleted.`);
    } else {
      console.log("No suspended users to delete.");
    }
  } catch (error) {
    console.error("Error deleting suspended users:", error);
  }
}
