let dataMock = [];

const renderIconVersus = () => {
  return `
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M13 1L1 13" stroke="#D1D1D1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <path d="M1 1L13 13" stroke="#D1D1D1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      `;
};

const getColorTeam = (teamName) => {
  const teams = [
    {
      name: "time-a",
      color1: "#FF0000",
      color2: "#E96565",
      url: "paint0_linear_1_28",
    },
    {
      name: "time-b",
      color1: "#0038FF",
      color2: "#0038FF",
      url: "paint0_linear_1_36",
    },
    {
      name: "time-c",
      color1: "#FF9900",
      color2: "#FF9900",
      url: "paint0_linear_1_50",
    },
    {
      name: "time-d",
      color1: "#72CB00",
      color2: "#72CB00",
      url: "paint0_linear_1_52",
    },
    {
      name: "time-e",
      color1: "#00C797",
      color2: "#00C797",
      url: "paint0_linear_1_67",
    },
    {
      name: "time-f",
      color1: "#0088D4",
      color2: "#22B0FF",
      url: "paint0_linear_1_69",
    },
    {
      name: "time-g",
      color1: "#AD00FF",
      color2: "#BF65E9",
      url: "paint0_linear_1_84",
    },
    {
      name: "time-h",
      color1: "#FF00E6",
      color2: "#FF00D6",
      url: "paint0_linear_1_86",
    },
  ];

  const findTeam = teams.find((item) => item.name === teamName);

  if (findTeam === undefined) {
    return { name: "time-b", color1: "#0038FF", color2: "#0038FF" };
  }

  return findTeam;
};

const renderIcon = (teamId) => {
  const teamProps = getColorTeam(teamId);

  return `
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40" fill="none">
          <path d="M16 0C14.8835 1.49628 14.1602 4.31649 9.54496 5.01371C9.11253 5.07638 8.70368 5.10772 8.31056 5.10772C5.38575 5.10772 3.61671 3.51743 3.61671 3.51743L0 7.31688C0 7.31688 5.59803 9.10302 1.11646 25.1156C-1.91843 35.9577 14.5926 37.6028 16 40C17.3995 37.6028 33.9106 35.9577 30.8835 25.1156C26.4098 9.10302 32 7.31688 32 7.31688L28.3754 3.51743C28.3754 3.51743 26.6064 5.10772 23.6816 5.10772C23.2885 5.10772 22.8796 5.07638 22.4472 5.01371C17.8398 4.32432 17.1165 1.49628 15.9921 0L16 0Z"
          fill="url(#${teamProps?.url})"/>
          <defs>
              <linearGradient
                  id="${teamProps?.url}"
                  x1="16"
                  y1="0"
                  x2="16"
                  y2="40"
                  gradientUnits="userSpaceOnUse"
              >
              <stop stop-color="${teamProps?.color1}" />
              <stop
              offset="1"
              stop-color="${teamProps?.color2}"
              stop-opacity="0.3"
              />
          </linearGradient>
          </defs>
      </svg>
      `;
};

const renderGame = (data) => {
  return `
    <div class="itemGame">
        <div class="team teamLeft">
            ${renderIcon(data.team_home_id)}
            <h2>${data.team_home_name}</h2>
            <h3>${data.team_home_score}</h3>
        </div>
        <div>
            ${renderIconVersus()}
        </div>
        <div class="team teamRight">
            ${renderIcon(data.team_away_id)}
            <h2>${data.team_away_name}</h2>
            <h3>${data.team_away_score}</h3>
        </div>
    </div>
  `;
};

const getRound = (round) => {
  return dataMock.find((item) => item.round === round);
};

const renderGameByRound = (gameRound) => {
  const data = getRound(gameRound);

  document.querySelector("#round").innerText = data.round;

  document.querySelector(".contentGameRoundBody").innerHTML = `${data.games
    .map((item) => {
      return renderGame(item);
    })
    .join("")}`;
};

const buttonNext = document.querySelector("#buttonNext");
const buttonPrev = document.querySelector("#buttonPrev");

const navigate = (direction) => {
  const showRound = Number(document.querySelector("#round").innerText);

  if (direction === "prev") {
    const findPrevRound = dataMock.find((item) => item.round === showRound - 1);

    if (findPrevRound !== undefined) {
      document.querySelector("#round").innerText = findPrevRound.round;
      renderGame(findPrevRound.round);
      findPrevRound.round == 1 && buttonPrev.classList.add("disabled");
    } else {
      buttonPrev.classList.add("disabled");
    }
  } else if (direction === "next") {
    const findNextRound = dataMock.find((item) => item.round === showRound + 1);

    if (findNextRound !== undefined) {
      document.querySelector("#round").innerText = findNextRound.round;
      renderGame(findNextRound.round);
      findNextRound.round === dataMock.at(-1).round &&
        buttonNext.classList.add("disabled");
    } else {
      buttonNext.classList.add("disabled");
    }
  }
};

buttonNext.addEventListener("click", () => {
  if (buttonNext.classList.contains("disabled")) {
    return;
  }
  buttonPrev.classList.remove("disabled");

  navigate("next");
});

buttonPrev.addEventListener("click", () => {
  if (buttonPrev.classList.contains("disabled")) {
    return;
  }
  buttonNext.classList.remove("disabled");

  navigate("prev");
});

async function getGames() {
  try {
    const response = await axios.get("https://sevn-pleno-esportes.deno.dev/");
    dataMock = response?.data;
  } catch (error) {
    console.error(error);
  }
}

window.onload = async () => {
  await getGames();

  renderGameByRound(1);
};
