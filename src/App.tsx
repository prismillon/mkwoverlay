import React, { useEffect } from "react";
import "./App.css";

import g0 from "./char/g0.png";
import g1 from "./char/g1.png";
import g2 from "./char/g2.png";
import g3 from "./char/g3.png";
import g4 from "./char/g4.png";
import g5 from "./char/g5.png";
import g6 from "./char/g6.png";
import g7 from "./char/g7.png";
import g8 from "./char/g8.png";
import g9 from "./char/g9.png";
import gplus from "./char/gplus.png";

import r0 from "./char/r0.png";
import r1 from "./char/r1.png";
import r2 from "./char/r2.png";
import r3 from "./char/r3.png";
import r4 from "./char/r4.png";
import r5 from "./char/r5.png";
import r6 from "./char/r6.png";
import r7 from "./char/r7.png";
import r8 from "./char/r8.png";
import r9 from "./char/r9.png";
import rminus from "./char/rminus.png";

import y0 from "./char/y0.png";
import y1 from "./char/y1.png";
import y2 from "./char/y2.png";
import y3 from "./char/y3.png";
import y4 from "./char/y4.png";
import y5 from "./char/y5.png";
import y6 from "./char/y6.png";
import y7 from "./char/y7.png";
import y8 from "./char/y8.png";
import y9 from "./char/y9.png";
import yminus from "./char/yminus.png";
import { animated, useSpring } from "@react-spring/web";
import crown from "./crownie_from_lr.png";

const CharMap = {
  r0: r0,
  r1: r1,
  r2: r2,
  r3: r3,
  r4: r4,
  r5: r5,
  r6: r6,
  r7: r7,
  r8: r8,
  r9: r9,
  "r-": rminus,
  g0: g0,
  g1: g1,
  g2: g2,
  g3: g3,
  g4: g4,
  g5: g5,
  g6: g6,
  g7: g7,
  g8: g8,
  g9: g9,
  "g+": gplus,
  y0: y0,
  y1: y1,
  y2: y2,
  y3: y3,
  y4: y4,
  y5: y5,
  y6: y6,
  y7: y7,
  y8: y8,
  y9: y9,
  "y-": yminus,
};

type PlayerResult = {
  player_id: number;
  player_name: string;
  player_country_flag: string;
  game_controller: string;
  discord_user_id: string;
  player_names: string;
  name_count: number;
  ladder_id: number;
  base_mmr: number;
  base_lr: number;
  strikes: number;
  game_counter: number;
  reset_game_counter: number;
  is_placement: number;
  current_mmr: number;
  current_lr: number;
  peak_mmr: number;
  peak_lr: number;
  lowest_mmr: number;
  lowest_lr: number;
  wins: number;
  loss: number;
  max_gain_mmr: number;
  max_gain_lr: number;
  max_loss_mmr: number;
  max_loss_lr: number;
  win_percentage: number;
  gainloss10_mmr: number;
  gainloss10_lr: number;
  wins10: number;
  loss10: number;
  win10_percentage: number;
  win_streak: number;
  top_score: number;
  average_score: number;
  average10_score: number;
  std_score: number;
  std10_score: number;
  total_events: number;
  penalties: number;
  max_strikes: number;
  ranking: string;
  percentile: number;
  previous_ranking: string;
  previous_percentile: number;
  last_event_date: string;
  total_events_since_date: number;
  since_date: string;
  update_date: string;
  current_division: string;
  current_class: string;
  url: string;
  current_emblem: string;
};

type ApiResponse = {
  status: "success" | "error";
  results: PlayerResult[];
};

export default function App() {
  const searchParams = new URLSearchParams(window.location.search);
  const ladderType = searchParams.get("ct") === null ? "rt" : "ct";
  const mmrType = searchParams.get("mmr") === null ? "lr" : "mmr";
  const displayType = searchParams.get("mk8dx") === null ? "mkw" : "mk8dx";
  const name = searchParams.get("name");

  const [mmr, setMmr] = React.useState<number | null>(null);
  const mmrRef = React.useRef<number | null>(null);
  const [rankURL, setRankURL] = React.useState("");
  const [diff, setDiff] = React.useState("");
  const [modClass, setModClass] = React.useState("");
  const props = useSpring({ mmr });

  useEffect(() => {
    mmrRef.current = mmr;
  }, [mmr]);

  useEffect(() => {
    const fetchData = () =>
      fetch(
        `https://www.mkwlounge.gg/api/ladderplayer.php?ladder_type=${ladderType}&player_names=${name}`
      )
        .then((response) => response.json())
        .then((res: ApiResponse) => res.results)
        .then((players) => {
          if (players.length === 0) {
            return;
          }
          const data = players[0];
          console.log("data: ", data);
          if (mmrType === "lr") {
            if (data.current_lr === mmrRef.current) {
              console.log(
                `no change new: ${data.current_lr} / current: ${mmrRef.current}`
              );
              return;
            }
          } else if (mmrType === "mmr") {
            if (data.current_mmr === mmrRef.current) {
              console.log(
                `no change new: ${data.current_mmr} / current: ${mmrRef.current}`
              );
              return;
            }
          }
          console.log(
            `change detected, new: ${
              mmrType === "lr" ? data.current_lr : data.current_mmr
            }/ current: ${mmrRef.current}`
          );

          const change =
            mmrRef.current !== null
              ? mmrType === "lr"
                ? data.current_lr - mmrRef.current
                : data.current_mmr - mmrRef.current
              : 0;
          console.log(`change: ${change}`);
          mmrType === "lr" ? setMmr(data.current_lr) : setMmr(data.current_mmr);
          if (change > 0) {
            setModClass("modifier green");
            setDiff("+" + change);
          } else if (change < 0) {
            setModClass("modifier red");
            setDiff(change.toString());
          } else {
            setModClass("modifier disabled");
            setDiff(change.toString());
          }
          if (data.ranking !== "1") {
            setRankURL(data.current_emblem);
          } else {
            setRankURL(crown);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });

    fetchData();
    const id = setInterval(fetchData, 120000);
    return () => clearInterval(id);
  }, [ladderType, name, mmrType]);

  if (name === null) {
    return (
      <div>
        <p>
          no stat to display, please check the url and make sure you have
          ?name=your_name (and &ct if you want to use ct mode) in the url
        </p>
      </div>
    );
  }

  if (displayType === "mkw") {
    return (
      <div className="stats">
        <p className="wrapper">
          <img src={rankURL} className="logo" alt="" />
          <LrConverter mmr={mmr ?? 0} />
          <Modifier modClass={modClass} modifier={diff} />
        </p>
      </div>
    );
  }
  return (
    <div className="stats">
      <p className="mk8dx_wrapper">
        <img src={rankURL} className="mk8dx_logo" alt="" />
        <animated.a>{props.mmr.to((x) => (x ?? 0).toFixed(0))}</animated.a>
        <Mk8dx_Mod modClass={modClass} modifier={diff} />
      </p>
    </div>
  );
}

function Mk8dx_Mod({
  modClass,
  modifier,
}: {
  modClass: string;
  modifier: string;
}) {
  return <span className={modClass}>{modifier}</span>;
}

function Modifier({
  modClass,
  modifier,
}: {
  modClass: string;
  modifier: string;
}) {
  return (
    <span className={modClass}>
      <ModifierConverter modifier={modifier} />
    </span>
  );
}

function LrConverter({ mmr }: { mmr: number }) {
  const value = mmr
    .toString()
    .split("")
    .map((char, index) => {
      return (
        <img
          key={index}
          src={CharMap[("y" + char) as keyof typeof CharMap]}
          alt={""}
        />
      );
    });

  return <a>{value}</a>;
}

function ModifierConverter({ modifier }: { modifier: string }) {
  const sign = modifier.toString().split("")[0];
  const mod = sign === "+" ? "g" : sign === "-" ? "r" : "y";
  const value = modifier
    .toString()
    .split("")
    .map((char, index) => {
      return (
        <img
          key={index}
          className="diff"
          src={CharMap[(mod + char) as keyof typeof CharMap]}
          alt={""}
        />
      );
    });
  return <a className="diffbox">{value}</a>;
}
