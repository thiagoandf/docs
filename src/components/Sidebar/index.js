import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import "./index.css";

export default function DocumentationSidebar(props) {

  const getItemName = page => {
    const fileName = page.path.split("/")[page.path.split("/").length - 1];
    return fileName.slice(0, -3);
  };

  const getTitle = page => (
    <div className="baseListItem" key={page.path}>
      <p className="title">{page.path}</p>
    </div>
  );

  const getLink = page => (
    <div
      key={page.path}
      className={clsx("baseListItem", {
        "selectedLinkContainer": props.selected.path === page.path,
        "linkContainer": props.selected.path !== page.path
      })}
      role="button"
      onClick={() => props.switchPage(page)}
      onKeyDown={() => props.switchPage(page)}
      tabIndex={0}
    >
      <p
        className={clsx({
          "selectedLink": props.selected.path === page.path,
          "link": props.selected.path !== page.path
        })}
      >
        {getItemName(page)}
      </p>
    </div>
  );

  const getDrawer = page => (
    <div
      key={page.path}
    >
      <div
        style={{
          backgroundColor: props.selected.path === page.path && "#e6e7f1"
        }}
      >
        <p
          className={clsx({
            "selectedLink": props.selected.path === page.path,
            "link": props.selected.path !== page.path
          })}
        >
          {page.path.split("/")[page.path.split("/").length - 1]}
        </p>
      </div>
      <div className="expansionDetail">
        {page.children.map(subPage => getPage(subPage))}
      </div>
    </div>
  );

  const getPage = page => {
    switch (page.type) {
      case "title":
        return [getTitle(page), page.children.map(c => getPage(c))];
      case "blob":
        return getLink(page);
      case "tree":
        return getDrawer(page);
      default:
        return <div key={page.path} />;
    }
  };

  return (
    <div className="sidebar">
      {props.pages &&
        Object.keys(props.pages).map(key => getPage(props.pages[key]))
      }
    </div>
  );
}

DocumentationSidebar.defaultProps = {
  switchPage: () => {},
  selected: "documentationIntroduction"
};

DocumentationSidebar.propTypes = {
  selected: PropTypes.object,
  switchPage: PropTypes.func,
  pages: PropTypes.object
};
