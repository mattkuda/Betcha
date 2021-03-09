import React from "react";
import "./SearchBox.css";
import { Link } from "react-router-dom";


function onClickItem(item) {
  console.log("Selected " + item.name);
}

const SearchBox = (props) => {
  return (
    <div className="wrapper">
      <div className="search">
        <input id="search"
        type = "search"
        placeholder = {props.placeholder}
        onChange = {props.handleChange}
        />
        <i class="fas fa-search"></i>
      </div>
      <ul className="list">
        {props.filtered.map(item => (
          <Link to={"/user/" + item.username}>
            <li onClick={() => onClickItem(item)}>{item.name}</li>
          </Link>
        ))}
      </ul>
    </div>

  )
}

export default SearchBox;
