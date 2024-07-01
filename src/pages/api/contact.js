import prisma from '@/lib/prisma';
import AuthMiddleware from '@/middlewares/AuthMiddelware';

function handler(req, res, session) {
  switch (req.method) {
    case 'GET':
      handlerGet(req, res, session);
      break;
    case 'POST':
      handlerPost(req, res, session);
      break;
  }
}

const handlerGet = async (req, res, session) => {
  try {
    const { user } = session;
    const userId = Number(user.id);
    const getRoom = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        userRoom: true,
      },
    });

    const getUserRoomId = getRoom.userRoom.map(({ roomId }) => {
      return roomId;
    });

    const getUsers = await prisma.user.findMany({
      where: { id: { not: userId } },
      include: {
        userRoom: true,
      },
    });

    const users = getUsers.map((item) => {
      const isHasRoom = getUserRoomId.includes(item?.userRoom[0]?.roomId) || false;
      return {
        ...item,
        isHasRoom,
      };
    });
    console.log({ users });
    return res.status(200).json({ message: 'success', data: users });
  } catch (error) {
    res.status(500).json({ message: 'Internal serverl error', error });
  }
};

const handlerPost = async (req, res, session) => {
  try {
    const { user } = session;
    const userId = Number(user.id);
    const { target } = req.body;
    const targetId = Number(target);

    const room = await prisma.room.create({
      data: {
        userRoom: {
          create: [{ userId: userId }, { userId: targetId }],
        },
      },
      include: {
        userRoom: true,
      },
    });
    return res.status(200).json({ message: 'success', data: room });
  } catch (error) {
    res.status(500).json({ message: 'Internal serverl error', error });
  }
};

export default AuthMiddleware(handler);
