import { TYPE_ICONS } from './iconMaps';
import { mediaStyle } from '../utils/media';

/**
 * The gradient "photo" block used on cards and in the modal. The property-type
 * glyph sits behind the content as a watermark so the block reads as designed
 * artwork rather than a failed image load.
 */
export default function HotelMedia({ hotel, className = '', children }) {
  const TypeIcon = TYPE_ICONS[hotel.type];

  return (
    <div className={`media ${className}`} style={mediaStyle(hotel.id)} aria-hidden="true">
      <div className="media-glow" />
      {TypeIcon && <TypeIcon className="media-watermark" />}
      {children}
    </div>
  );
}
