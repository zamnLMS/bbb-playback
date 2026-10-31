import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Image from './image';
import { thumbnails as config } from 'config';
import { ID } from 'utils/constants';
import './index.scss';

const propTypes = {
  alt: PropTypes.string,
  height: PropTypes.number,
  index: PropTypes.number,
  src: PropTypes.string,
  width: PropTypes.number,
  windowed: PropTypes.bool,
};

const defaultProps = {
  alt: '',
  height: 0,
  index: 0,
  src: '',
  width: 0,
  windowed: false,
};

const Thumbnail = ({
  alt,
  height,
  index,
  src,
  width,
  windowed,
}) => {
  const node = useRef();
  const [near, setNear] = useState(false);

  // A slide can be a heavy SVG, so long recordings keep only the nearby ones in memory
  useEffect(() => {
    if (!windowed) return;

    const observer = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      {
        root: node.current.closest('.thumbnails-wrapper'),
        rootMargin: `0px ${config.window.margin}px`,
      },
    );

    observer.observe(node.current);

    return () => observer.disconnect();
  }, [windowed]);

  const show = !windowed || near || src === ID.SCREENSHARE;
  const style = windowed ? { aspectRatio: `auto ${width} / ${height}` } : undefined;

  return (
    <div className="thumbnail" ref={node}>
      {show ? (
        <Image
          alt={alt}
          src={src}
          style={style}
        />
      ) : (
        <div
          className="thumbnail-image"
          style={style}
        />
      )}
      <div className="thumbnail-index">
        {index + 1}
      </div>
    </div>
  )
};

Thumbnail.propTypes = propTypes;
Thumbnail.defaultProps = defaultProps;

export default Thumbnail;
