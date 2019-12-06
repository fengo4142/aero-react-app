/* eslint-disable camelcase */
import L from 'leaflet';
import styles from './map.module.scss';

const CustomIcon = L.DivIcon.extend({
  createIcon() {
    const icon = L.DivIcon.prototype.createIcon.call(this);
    icon.style.backgroundColor = this.options.color;
    icon.style.border = '2px solid #E7F2FC';
    icon.style.borderRadius = '50%';
    return icon;
  }
});

const IconImage = L.DivIcon.extend({
  createIcon() {
    const icon = L.DivIcon.prototype.createIcon.call(this);
    icon.style.backgroundImage = `url(${this.options.icon})`;
    icon.style.width = '30px';
    icon.style.height = '15px';
    icon.style.backgroundSize = 'contain';
    icon.style.backgroundPosition = 'center';
    // icon.style.cursor = 'none';
    icon.style.backgroundRepeat = 'no-repeat';
    icon.style.backgroundColor = 'transparent';
    // icon.style.border = 'none';
    return icon;
  }
});

const toggleZooming = (map, action) => {
  map.dragging[action]();
  map.touchZoom[action]();
  map.doubleClickZoom[action]();
  map.scrollWheelZoom[action]();
  map.boxZoom[action]();
  map.keyboard[action]();
};

const addPopupToLayer = (surface, layer) => {
  const { surface_type: { name, color } } = surface;
  const customPopup = `
    <div class=${styles.tooltipHeader}>
        <h4>${surface.name}</h4>
        <a href="/#"> view details </a>
    </div>   
    <p>${name}</p>
  `;
  // specify popup options
  const customOptions = { className: styles.tooltip, width: '200' };
  const customlayer = layer.bindPopup(customPopup, customOptions);

  customlayer.setStyle({
    fillColor: color,
    color,
    opacity: 1,
    fillOpacity: 0.48
  });

  return customlayer;
};

const disableEditMarkers = (map) => {
  // Disable editing marker if any
  map.eachLayer((layer) => {
    if (layer.editing && layer.editing.enabled()) {
      layer.editing.disable();
    }
  });
};

export {
  CustomIcon,
  addPopupToLayer,
  toggleZooming,
  IconImage,
  disableEditMarkers
};
