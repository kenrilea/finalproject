import React, { Component } from "react";
import { connect } from "react-redux";
import MenuItem from "./MenuItem.jsx";

class Menu extends Component {
  render = () => {
    if (!this.props.actionMenu.visible) return null;

    const style = {
      position: "absolute",
      zIndex: 100,
      margin: 0,
      paddingTop: "10px",
      width: "120px",
      height: "auto",
      background: "#000000"
    };

    const xPercent = this.props.actionMenu.xPos;
    if (xPercent < 50) {
      style.left = xPercent + this.props.dimensions.w + "%";
    } else {
      style.right = 100 - xPercent + "%";
    }

    const yPercent = this.props.actionMenu.yPos;
    if (yPercent < 50) {
      style.top = yPercent + "%";
    } else {
      style.bottom = 100 - yPercent - this.props.dimensions.h + "%";
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
