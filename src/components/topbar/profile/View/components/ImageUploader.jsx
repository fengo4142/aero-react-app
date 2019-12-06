/* global File */
import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import Editor from 'react-avatar-editor';
import { FormattedMessage } from 'react-intl';

import styles from '../ProfileEdit.module.scss';

class ImageUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = { image: '' };
    this.editor = React.createRef();

    this.handleDrop = this.handleDrop.bind(this);
    this.handlePositionChange = this.handlePositionChange.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    if (state.image) return null;
    return { image: props.image };
  }

  handleDrop(dropped) {
    const { onChangeImage } = this.props;
    const [image] = dropped;
    this.setState(prevState => ({ ...prevState, image }));
    onChangeImage(image);
  }

  handlePositionChange() {
    const { onChangeImage, profile } = this.props;
    const img = this.editor.current.getImage();
    img.toBlob((blob) => {
      const file = new File([blob], `${profile}.jpg`);
      onChangeImage(file);
    });
  }


  render() {
    const { image } = this.state;

    return (
      <>
        <Dropzone onDrop={this.handleDrop} disableClick className={`${styles.dropzone} ${image ? styles.hasImage : ''}`}>
          {({ open }) => (
            <>
              <p className={styles.browsetext}>
                <FormattedMessage id="profile.logo.text1" defaultMessage="Drag an image here or" />
                <button type="button" onClick={() => open()}>
                  <FormattedMessage id="profile.logo.button" defaultMessage="browse" />
                </button>
                <FormattedMessage id="profile.logo.text2" defaultMessage="for an image to upload." />
              </p>
              <Editor ref={this.editor} border={0} width={400} height={300}
                className={styles.editor} image={image}
                onPositionChange={this.handlePositionChange} crossOrigin="anonymous"
              />
            </>
          )}
        </Dropzone>
        <p className={styles.helptext}>
          <FormattedMessage
            id="profile.logo.helptext"
            defaultMessage="JPG or PNG. For a better experience we recommend
            shots that are 400 × 300 pixels or 800 × 600. If your
             image is bigger than the sizes above, we’ll help you crop it."
          />
        </p>
      </>
    );
  }
}

ImageUploader.propTypes = {
  onChangeImage: PropTypes.func.isRequired,
  profile: PropTypes.string
};

ImageUploader.defaultProps = {
  profile: 'profile'
};

export default ImageUploader;
