import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Badge,
  Layout,
  Spinner,
} from '@folio/stripes/components';
import { DocumentCard } from '@folio/stripes-erm-components';

export default class CoreDocs extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    handlers: PropTypes.shape({
      onDownloadFile: PropTypes.func,
    }),
    record: PropTypes.shape({
      docs: PropTypes.arrayOf(
        PropTypes.shape({
          dateCreated: PropTypes.string,
          lastUpdated: PropTypes.string,
          location: PropTypes.string,
          name: PropTypes.string.isRequired,
          note: PropTypes.string,
          url: PropTypes.string,
        }),
      ),
    }).isRequired,
    recordType: PropTypes.string.isRequired,
  };

  renderDocs = (docs) => {
    return docs.map(doc => (
      <DocumentCard
        key={doc.id}
        onDownloadFile={this.props.handlers.onDownloadFile}
        {...doc}
      />
    ));
  }

  renderBadge = () => {
    const count = get(this.props.record, ['docs', 'length']);
    return count !== undefined ? <Badge>{count}</Badge> : <Spinner />;
  }

  render() {
    const { id, recordType } = this.props;
    const { docs = [] } = this.props.record;

    return (
      <FormattedMessage id={`ui-licenses.${recordType}`}>
        {([type]) => (
          <Accordion
            displayWhenClosed={this.renderBadge()}
            displayWhenOpen={this.renderBadge()}
            id={id}
            label={<FormattedMessage id="ui-licenses.section.coreDocs" />}
          >
            <Layout className="padding-bottom-gutter">
              { docs.length ? this.renderDocs(docs) : <FormattedMessage id="ui-licenses.emptyAccordion.coreDocuments" values={{ type: type.toLowerCase() }} /> }
            </Layout>
          </Accordion>
        )}
      </FormattedMessage>
    );
  }
}
