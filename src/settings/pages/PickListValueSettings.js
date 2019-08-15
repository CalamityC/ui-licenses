import React from 'react';
import PropTypes from 'prop-types';
import { ControlledVocab } from '@folio/stripes/smart-components';
import { Select } from '@folio/stripes/components';
import { IntlConsumer } from '@folio/stripes/core';

export default class PickListValueSettings extends React.Component {
  static manifest = {
    categories: {
      type: 'okapi',
      path: 'licenses/refdata',
      accumulate: true,
    },
  };

  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      categories: PropTypes.arrayOf({
        id: PropTypes.string,
        desc: PropTypes.string,
        values: PropTypes.arrayOf({
          id: PropTypes.string,
          value: PropTypes.string,
          label: PropTypes.string,
        }),
      }),
    }),
    mutator: PropTypes.shape({
      categories: PropTypes.shape({
        GET: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
      }),
    })
  };

  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);

    this.state = {
      categoryId: null,
    };
  }

  /**
   * Refresh lookup tables when the component mounts. Fetches in the manifest
   * will only run once (in the constructor) but because this object may be
   * unmounted/remounted without being destroyed/recreated, the lookup tables
   * will be stale if they change between unmounting/remounting.
   */
  componentDidMount() {
    ['categories'].forEach(i => {
      this.props.mutator[i].reset();
      this.props.mutator[i].GET();
    });
  }

  onChangeCategory = (e) => {
    this.setState({ categoryId: e.target.value });
  }

  renderCategories(intl) {
    const categories = [];
    categories.push(
      { value: 'empty', label: intl.formatMessage({ id: 'ui-licenses.pickListSelect' }) }
    );

    (((this.props.resources.categories || {}).records || []).forEach(i => {
      categories.push(
        { value: i.id, label: i.desc }
      );
    }));

    if (!categories.length) {
      return <div />;
    }

    return categories;
  }

  renderRowFilter(intl) {
    return (
      <Select
        dataOptions={this.renderCategories(intl)}
        id="categorySelect"
        label={intl.formatMessage({ id: 'ui-licenses.pickList' })}
        name="categorySelect"
        onChange={this.onChangeCategory}
      />
    );
  }

  render() {
    return (
      <IntlConsumer>
        {intl => (
          <this.connectedControlledVocab
            {...this.props}
            actuatorType="refdata"
            baseUrl={`licenses/refdata/${this.state.categoryId}`}
            columnMapping={{
              label: intl.formatMessage({ id: 'ui-licenses.headings.value' }),
              actions: intl.formatMessage({ id: 'ui-licenses.actions' }),
            }}
        // We have to unset the dataKey to prevent the props.resources in
        // <ControlledVocab> from being overwritten by the props.resources here.
            dataKey={undefined}
            hiddenFields={['lastUpdated', 'numberOfObjects']}
            id="pick-list-values"
            label={intl.formatMessage({ id: 'ui-licenses.settings.pickListValues' })}
            nameKey="label"
            preCreateHook={(item) => Object.assign({}, item, { id: this.state.categoryId })}
            records="values"
            rowFilter={this.renderRowFilter(intl)}
            sortby="label"
            stripes={this.props.stripes}
            visibleFields={['label']}
          />
        )}
      </IntlConsumer>
    );
  }
}
