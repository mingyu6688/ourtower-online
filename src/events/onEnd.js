import { getGameSessions } from "../session/game.session.js";
import { getUserBySocket } from "../session/user.session.js";

export const onEnd = (socket) => async () => {
  console.log(`클라이언트 연결이 종료되었습니다.`);

  // 유저가 접속해 있던 게임 세션이 존재하는가?
  const user = getUserBySocket(socket);
  const gameSession = getGameSessions().find((session) => session.users.includes(user));
  
  if(gameSession) {
    console.log('클라이언트 종료가 발견되어 상대방 유저가 승리합니다.');
    
    // 상대를 승리시키고 게임오버 패킷 전달
    user.winLose = false;

    const opponentUser = gameSession.users.find((findUser) => findUser.id !== user.id);

    await gameSession.updateScore(user, opponentUser);

    gameSession.gameOver();
  }
};
