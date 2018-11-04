import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Pluggable } from '@folio/stripes/core';

import {
  Accordion,
  AccordionSet,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import css from './LicenseInfo.css';

class LicenseInfo extends React.Component {

  static propTypes = {
    license: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    stripes: PropTypes.object,
  };

  render() {
    const { license, stripes: { intl } } = this.props;

    return (
      <Accordion
        id={this.props.id}
        label={intl.formatMessage({ id: 'ui-licenses.licenses.licenseInfo' })}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <Row>
          <Col xs={12}>
            <KeyValue
              label={intl.formatMessage({ id: 'ui-licenses.licenses.licenseName' })}
              value={license.name}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
	    <Pluggable
              aria-haspopup="true"
              type="find-license"
              dataKey="license"
              searchLabel="+"
              searchButtonStyle="default"
              selectLicense={license => console.log("License selected %o",license)}
              {...this.props}
            >
              <span>[no license-selection plugin]</span>
            </Pluggable>

          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <KeyValue
              label={intl.formatMessage({ id: 'ui-licenses.licenses.licenseDescription' })}
              value={license.description}
            />
          </Col>
        </Row>
      </Accordion>
    );
  }
}

export default LicenseInfo;
