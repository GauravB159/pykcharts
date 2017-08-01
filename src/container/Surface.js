/**
 * @fileOverview Surface
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { getPresentationAttributes } from '../util/ReactUtils';

const propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  viewBox: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};
function Surface(props) {
  const { children, width, height, viewBox, className, style,horizontal, ...others } = props;
  const svgView = viewBox || { width, height, x: 0, y: 0 };
  const layerClass = classNames('recharts-surface', className);
  const attrs = getPresentationAttributes(others);

  return (
    <svg
      {...attrs}
      className={layerClass}
      width={width}
      height={height}
      style={style}
      viewBox={`${svgView.x} ${svgView.y} ${svgView.width} ${svgView.height}`}
      version="1.1"
      transform = {horizontal === true ? "translate(-" + svgView.height*1.5 + " -" + 0.25*svgView.height + ") rotate(90 " + svgView.height  + " " + svgView.height + ") " : null}
    >
      {children}
    </svg>
  );
}

Surface.propTypes = propTypes;

export default Surface;
