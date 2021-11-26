import React from "react";

import tree from "../../images/decorations/tree.png";
import woodHorizontal from "../../images/fence/wood_horizontal.png";
import woodPost from "../../images/fence/wood_post.png";
import woodHalf from "../../images/fence/wood_half.png";
import bucket from "../../images/decorations/bucket.png";
import flower1 from "../../images/decorations/flower1.png";
import flower2 from "../../images/decorations/flower2.png";
import stump from "../../images/decorations/stump.png";
import rock1 from "../../images/decorations/rock2.png";
import rock2 from "../../images/decorations/rock3.png";
import grassLeaves1 from "../../images/decorations/grassLeaves1.png";
import grassLeaves2 from "../../images/decorations/grassLeaves2.png";
import bridge from "../../images/decorations/bridge.png";

interface Props {}

const fields = [1, 4, 6, 10, 13, 15];

// Repeated decorations to
const DecorationFiller = () => (
  <>
    {fields.map((position, index) => (
      <>
        <div
          style={{
            gridColumn: `${position}/${position + 1}`,
            gridRow: `${index + 3}/${index + 4}`,
          }}
        >
          <img className="flowers" src={flower1} />
        </div>

        <div
          style={{
            gridColumn: `${position + 1}/${position + 2}`,
            gridRow: `${index + 6}/${index + 7}`,
          }}
        >
          <img className="flowers" src={grassLeaves1} />
        </div>

        <div
          style={{
            gridColumn: `${position}/${position + 1}`,
            gridRow: `${index + 5}/${index + 6}`,
          }}
        >
          <img className="leaves" src={grassLeaves2} />
        </div>

        <div
          style={{
            gridColumn: `${position + 1}/${position + 2}`,
            gridRow: `${index + 8}/${index + 9}`,
          }}
        >
          <img className="leaves" src={grassLeaves1} />
        </div>

        <div
          style={{
            gridColumn: `${position}/${position + 1}`,
            gridRow: `${index + 11}/${index + 12}`,
          }}
        >
          <img className="rock1" src={rock1} />
        </div>

        <div
          style={{
            gridColumn: `${position + 1}/${position + 2}`,
            gridRow: `${index + 13}/${index + 14}`,
          }}
        >
          <img className="rock1" src={rock2} />
        </div>
      </>
    ))}
  </>
);
export const Tiles: React.FC<Props> = () => {
  return (
    <>
      {/*First to second path*/}
      <div className="dirt" style={{ gridColumn: "4/5", gridRow: "8/9" }} />
      <div className="dirt" style={{ gridColumn: "5/6", gridRow: "8/9" }} />
      <div className="dirt" style={{ gridColumn: "6/7", gridRow: "8/9" }} />
      <div className="top-edge" style={{ gridColumn: "4/5", gridRow: "7/8" }} />
      <div
        className="bottom-edge"
        style={{ gridColumn: "4/5", gridRow: "9/10" }}
      />
      <div
        className="bottom-edge"
        style={{ gridColumn: "5/6", gridRow: "9/10" }}
      />
      <div
        className="bottom-edge"
        style={{ gridColumn: "6/7", gridRow: "9/10" }}
      />

      {/*Second to fourth path*/}
      <div className="dirt" style={{ gridColumn: "5/6", gridRow: "7/8" }} />
      <div className="dirt" style={{ gridColumn: "5/6", gridRow: "6/7" }} />
      <div className="dirt" style={{ gridColumn: "4/5", gridRow: "5/6" }} />
      <div className="dirt" style={{ gridColumn: "5/6", gridRow: "5/6" }} />
      <div
        className="left-edge"
        style={{ gridColumn: "4/5", gridRow: "6/7" }}
      />
      <div
        className="left-edge"
        style={{ gridColumn: "4/5", gridRow: "7/8" }}
      />
      <div
        className="right-edge"
        style={{ gridColumn: "7/8", gridRow: "6/7" }}
      />

      {/*Third to fifth path*/}
      <div className="dirt" style={{ gridColumn: "6/7", gridRow: "5/6" }} />
      <div className="dirt" style={{ gridColumn: "7/8", gridRow: "5/6" }} />
      <div className="dirt" style={{ gridColumn: "7/8", gridRow: "4/5" }} />
      <div className="dirt" style={{ gridColumn: "8/9", gridRow: "5/6" }} />
      <div className="dirt" style={{ gridColumn: "9/10", gridRow: "5/6" }} />
      <div className="dirt" style={{ gridColumn: "10/11", gridRow: "5/6" }} />
      <div className="dirt" style={{ gridColumn: "11/12", gridRow: "5/6" }} />
      <div className="top-edge" style={{ gridColumn: "4/5", gridRow: "4/5" }} />
      <div className="top-edge" style={{ gridColumn: "5/6", gridRow: "4/5" }} />
      <div className="top-edge" style={{ gridColumn: "6/7", gridRow: "4/5" }} />
      <div className="top-edge" style={{ gridColumn: "8/9", gridRow: "4/5" }} />
      <div
        className="top-edge"
        style={{ gridColumn: "9/10", gridRow: "4/5" }}
      />
      <div
        className="top-edge"
        style={{ gridColumn: "10/11", gridRow: "4/5" }}
      />

      <div
        className="bottom-edge"
        style={{ gridColumn: "4/5", gridRow: "6/7" }}
      />

      <div
        className="bottom-edge"
        style={{ gridColumn: "7/8", gridRow: "6/7" }}
      />
      <div
        className="bottom-edge"
        style={{ gridColumn: "8/9", gridRow: "6/7" }}
      />
      <div
        className="bottom-edge"
        style={{ gridColumn: "9/10", gridRow: "6/7" }}
      />
      <div
        className="bottom-edge"
        style={{ gridColumn: "10/11", gridRow: "6/7" }}
      />
      <div
        className="bottom-edge"
        style={{ gridColumn: "11/12", gridRow: "6/7" }}
      />
      <div
        className="right-edge"
        style={{ gridColumn: "12/13", gridRow: "5/6" }}
      />
      <div
        className="right-edge"
        style={{ gridColumn: "8/9", gridRow: "3/4" }}
      />
      <div
        className="right-edge"
        style={{ gridColumn: "8/9", gridRow: "4/5" }}
      />
      <div
        className="left-edge"
        style={{ gridColumn: "6/7", gridRow: "4/5" }}
      />

      {/* Fence */}
      <div style={{ gridColumn: "7/8", gridRow: "6/7" }}>
        <img className="fence-horizontal" src={woodHorizontal} />
      </div>
      <div style={{ gridColumn: "8/9", gridRow: "6/7" }}>
        <img className="fence-horizontal" src={woodHorizontal} />
      </div>
      <div style={{ gridColumn: "9/10", gridRow: "6/7" }}>
        <img className="fence-post" src={woodPost} />
      </div>

      <div style={{ gridColumn: "7/8", gridRow: "10/11" }}>
        <img className="fence-horizontal" src={woodHorizontal} />
      </div>
      <div style={{ gridColumn: "8/9", gridRow: "10/11" }}>
        <img className="fence-horizontal" src={woodHorizontal} />
      </div>
      <div style={{ gridColumn: "9/10", gridRow: "10/11" }}>
        <img className="fence-post" src={woodPost} />
      </div>

      <div style={{ gridColumn: "2/3", gridRow: "6/7" }}>
        <img className="fence-half" src={woodHalf} />
      </div>
      <div style={{ gridColumn: "3/4", gridRow: "6/7" }}>
        <img className="fence-half" src={woodHalf} />
      </div>
      <div style={{ gridColumn: "4/5", gridRow: "6/7" }}>
        <img className="fence-half" src={woodHalf} />
      </div>

      <div style={{ gridColumn: "2/3", gridRow: "10/11" }}>
        <img className="fence-half" src={woodHalf} />
      </div>
      <div style={{ gridColumn: "3/4", gridRow: "10/11" }}>
        <img className="fence-half" src={woodHalf} />
      </div>

      <div style={{ gridColumn: "6/7", gridRow: "4/5" }}>
        <img className="fence-half" src={woodHalf} />
      </div>

      {/* Decorations */}
      <div style={{ gridColumn: "10", gridRow: "10/11" }}>
        <img className="bucket" src={bucket} />
      </div>

      <div style={{ gridColumn: "15/16", gridRow: "3/4" }}>
        <img className="flowers" src={flower2} />
      </div>
      <div style={{ gridColumn: "8/9", gridRow: "3/4" }}>
        <img className="flowers" src={flower1} />
      </div>
      <div style={{ gridColumn: "4/5", gridRow: "4/5" }}>
        <img className="flowers" src={flower2} />
      </div>
      <div style={{ gridColumn: "2/3", gridRow: "7/8" }}>
        <img className="flowers" src={flower2} />
      </div>

      <div style={{ gridColumn: "2/3", gridRow: "7/8" }}>
        <img className="flowers" src={flower2} />
      </div>

      <div style={{ gridColumn: "3/4", gridRow: "2/3" }}>
        <img className="stump" src={flower1} />
      </div>

      <div style={{ gridColumn: "5/6", gridRow: "10/11" }}>
        <img className="stump" src={flower1} />
      </div>

      <div style={{ gridColumn: "5/6", gridRow: "3/4" }}>
        <img className="leaves" src={grassLeaves1} />
      </div>

      <div style={{ gridColumn: "9/10", gridRow: "2/3" }}>
        <img className="leaves" src={grassLeaves1} />
      </div>

      <div style={{ gridColumn: "14/15", gridRow: "2/3" }}>
        <img className="leaves" src={grassLeaves1} />
      </div>

      <div style={{ gridColumn: "3/4", gridRow: "7/8" }}>
        <img className="leaves" src={grassLeaves1} />
      </div>

      <div style={{ gridColumn: "1/2", gridRow: "9/10" }}>
        <img className="leaves" src={grassLeaves1} />
      </div>

      <div style={{ gridColumn: "5/6", gridRow: "12/13" }}>
        <img className="leaves" src={grassLeaves1} />
      </div>

      <div style={{ gridColumn: "10/11", gridRow: "7/8" }}>
        <img className="leaves" src={grassLeaves1} />
      </div>

      <div style={{ gridColumn: "1/2", gridRow: "4/5" }}>
        <img className="leaves" src={grassLeaves2} />
      </div>

      <div style={{ gridColumn: "10/11", gridRow: "4/5" }}>
        <img className="leaves" src={grassLeaves2} />
      </div>

      <div style={{ gridColumn: "7/8", gridRow: "11/12" }}>
        <img className="leaves" src={grassLeaves2} />
      </div>

      <div style={{ gridColumn: "11/12", gridRow: "11/12" }}>
        <img className="leaves" src={grassLeaves2} />
      </div>

      <div style={{ gridColumn: "13/14", gridRow: "4/5" }}>
        <img className="leaves" src={grassLeaves2} />
      </div>

      <div style={{ gridColumn: "15/16", gridRow: "8/9" }}>
        <img className="leaves" src={grassLeaves2} />
      </div>

      <div style={{ gridColumn: "10/11", gridRow: "6/7" }}>
        <img className="rock1" src={rock1} />
      </div>

      <div style={{ gridColumn: "6/7", gridRow: "9/10" }}>
        <img className="rock1" src={rock1} />
      </div>

      <div style={{ gridColumn: "2/3", gridRow: "12/13" }}>
        <img className="rock1" src={rock2} />
      </div>

      <div style={{ gridColumn: "12/13", gridRow: "12/13" }}>
        <img className="rock1" src={rock2} />
      </div>

      <div style={{ gridColumn: "5/6", gridRow: "14/15" }}>
        <img className="bridge" src={bridge} />
      </div>

      <div id="environment-left">
        <DecorationFiller />
      </div>

      <div id="environment-right">
        <DecorationFiller />
      </div>
    </>
  );
};
