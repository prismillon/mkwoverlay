import React, { useEffect } from "react";
import "./App.css";
import { useSpring, animated } from "@react-spring/web";

export default function App() {
  const searchParams = new URLSearchParams(window.location.search);
  const ladderType = searchParams.get("ct") === null ? "rt" : "ct";
  const name = searchParams.get("name");

  const [mmr, setMmr] = React.useState(0);
  const [rankURL, setRankURL] = React.useState("");
  const [diff, setDiff] = React.useState("");
  const [modClass, setModClass] = React.useState("");
  const props = useSpring({ mmr: mmr });

  useEffect(() => {
    const fetchData = () =>
      fetch(
        `https://www.mkwlounge.gg/api/ladderplayerevent.php?ladder_type=${ladderType}&player_names=${name}`
      )
        .then((response) => response.json())
        .then((res) => res.results)
        .then((data) => {
          if (data.length === 0) {
            return;
          }
          data = data[0];
          console.log(data);
          setMmr(data.updated_lr);
          setRankURL(data.updated_emblem);
          if (data.change_lr > 0) {
            setModClass("modifier green");
            setDiff("+" + data.change_lr);
          } else if (data.change_lr < 0) {
            setModClass("modifier red");
            setDiff(data.change_lr);
          } else {
            setModClass("modifier disabled");
            setDiff(data.change_lr);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });

    fetchData();
    const id = setInterval(fetchData, 120000);
    return () => clearInterval(id);
  }, [ladderType, name]);

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

  return (
    <div className="stats">
      <p className="wrapper">
        <img src={rankURL} className="image" alt="" />
        <animated.a>{props.mmr.to((x) => x.toFixed(0))}</animated.a>
        <Modifier modClass={modClass} modifier={diff} />
      </p>
    </div>
  );
}

function Modifier({
  modClass,
  modifier,
}: {
  modClass: string;
  modifier: string;
}) {
  return <span className={modClass}>{modifier}</span>;
}
