import React, { Component } from "react";
import { connect } from "react-redux";
import MenuItem from "./MenuItem.jsx";

class Menu extends Component {
  render = () => {
    if (!this.props.visible) return null;

    const style = {
      position: "absolute",
      bottom: "50%",
      zIndex: 100,
      margin: 0,
      paddingTop: "10px",
      width: "120px",
      height: "auto",
      background: "#000000"
    };

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
    visible: state.actionMenu.visible
  };
};

export default connect(mapStateToProps)(Menu);
