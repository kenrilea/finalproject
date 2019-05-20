import React, { Component } from "react";
import { connect } from "react-redux";
import MenuItem from "./MenuItem.jsx";

class Menu extends Component {
  render = () => {
    if (!this.props.actionMenu.visible) return null;

    const menuWidthPx = 120;

    const style = {
      position: "absolute",
      zIndex: 1000,
      margin: 0,
      //paddingTop: "10px",
      width: menuWidthPx + "px",
      height: "auto",
      background: "#000000"
    };

    const gameframeElem = this.props.getGameFrameElem().current;
    const gameframeDim = {
      width: gameframeElem.offsetWidth,
      height: gameframeElem.offsetHeight
    };

    console.log("ACTION MENU DIM: ", gameframeElem, gameframeDim);

    const xClickPos = this.props.actionMenu.xPos;
    const xPercent = (xClickPos / gameframeDim.width) * 100;
    if (xPercent < 50) {
      style.left =
        parseFloat(((xClickPos + 10) / gameframeDim.width) * 100) + "%";
    } else {
      style.left =
        parseFloat((xClickPos - menuWidthPx - 10) / gameframeDim.width) * 100 +
        "%";
    }

    const yClickPos = this.props.actionMenu.yPos;
    const yPercent = (yClickPos / gameframeDim.height) * 100;
    if (yPercent < 50) {
      style.top = yPercent + "%";
    } else {
      style.bottom = parseFloat(100 - yPercent) + "%";
    }

    return (
      <div style={style}>
        {this.props.options.map((option, index) => {
          return (
            <MenuItem
              index={index}
              text={option.text}
              callbackFunc={option.callbackFunc}
            />
          );
        })}
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    actionMenu: state.actionMenu,
    dimensions: {
      w: state.gameData.width,
      h: state.gameData.height
    }
  };
};

export default connect(mapStateToProps)(Menu);
