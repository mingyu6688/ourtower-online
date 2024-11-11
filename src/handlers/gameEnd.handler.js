import { config } from '../config/config.js';
import { INIT_BASE_DATA } from '../constants/game.js';
import { clearUserMosnterData } from '../models/monster.model.js';
import { getGameSessions, removeGame } from '../session/game.session.js';
import { getUserBySocket } from '../session/user.session.js';

const gameEndHandler = async ({ socket, userId, payload }) => {
  try {
    const user = getUserBySocket(socket);

    console.log('Game End 핸들러 실행');
    if (!user) {
      console.error('User not found');
    }

    const gameSessions = getGameSessions();
    const gameSession = gameSessions.find((session) => session.users.includes(user));
    const opponentUser = gameSession.users.find((findUser) => findUser.id !== user.id);

    if (gameSession) {
      if (!gameSession.users.find((findUser) => findUser.winLose === false)) {
        if (user.baseHp <= 0) {
          user.winLose = false;
          gameSession.gameOver();
        }
      }

      // 유저의 점수가 db에서 가진 최고점수를 넘겼다면 갱신
      await gameSession.updateScore(user, opponentUser);

      // 게임 데이터 정보 초기화
      user.gold = config.game.initData.gold;
      user.baseHp = config.game.initData.baseHp;
      user.score = 0;
      user.state = config.game.state.waiting;
      user.winLose = true;
      user.towers = [];
      user.monsters = [];
      clearUserMosnterData(user.id);

      opponentUser.gold = config.game.initData.gold;
      opponentUser.baseHp = config.game.initData.baseHp;
      opponentUser.score = 0;
      opponentUser.state = config.game.state.waiting;
      opponentUser.winLose = true;
      opponentUser.towers = [];
      opponentUser.monsters = [];
      clearUserMosnterData(opponentUser.id);

      removeGame(gameSession.id);
    } 
  } catch (e) {
    console.error('gameOverHandler Error: ', e);
  }
};

export default gameEndHandler;

// public void OnGameEnd()
// {
//     isGameStart = false;
//     monsters.ForEach(obj => obj.StopMonster());
//     towers.ForEach(obj => obj.StopTower());
//     monsters.Clear();
//     towers.Clear();
//     StopAllCoroutines();
//     StartCoroutine(OnSceneChange());
// }
