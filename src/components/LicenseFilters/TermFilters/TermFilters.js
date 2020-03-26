import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Accordion, FilterAccordionHeader, Layout } from '@folio/stripes/components';

import TermFiltersForm from './TermFiltersForm';
import getOperators from './getOperators';

const operators = getOperators().map(o => o.value);

export default class TermFilters extends React.Component {
  static propTypes = {
    activeFilters: PropTypes.object,
    data: PropTypes.object.isRequired,
    filterHandlers: PropTypes.object,
  };


  handleSubmit = values => {
    const { activeFilters, filterHandlers } = this.props;
    const { filters = [] } = values;

    const filterStrings = filters
      .filter(filter => filter.rules)
      .map(filter => filter.rules
        .map(rule => `customProperties.${filter.customProperty}.value${rule.operator}${rule.value ?? ''}`)
        .join('||'));

    filterHandlers.state({ ...activeFilters, terms: filterStrings });

    return Promise.resolve();
  }

  render() {
    const { activeFilters, data, filterHandlers } = this.props;

    let numberOfFilters = 0;
    const filterStrings = activeFilters.terms || [];
    const filters = filterStrings.map(filter => {
      let customProperty;
      const rules = filter.split('||').map(ruleString => {
        // ruleString is constructed in this.handleSubmit passed to TermFiltersForm
        // and has shape "customProperties.foo.value!=42"
        const [customPropertyPath, rule] = ruleString.split('.value');
        customProperty = customPropertyPath.replace('customProperties.', '');

        const operator = operators.find(o => rule.startsWith(o)) ?? '';
        const value = rule.substring(operator.length);

        numberOfFilters += 1;

        return { operator, value };
      });

      return {
        customProperty,
        rules,
      };
    });

    return (
      <Accordion
        closedByDefault
        displayClearButton={numberOfFilters > 0}
        header={FilterAccordionHeader}
        id="clickable-terms-filter"
        label={<FormattedMessage id="ui-licenses.section.terms" />}
        onClearFilter={() => filterHandlers.state({ ...activeFilters, terms: [] })}
        separator={false}
      >
        <Layout className="padding-bottom-gutter">
          <FormattedMessage
            id="ui-licenses.terms.filters.filtersApplied"
            values={{ count: numberOfFilters }}
          />
        </Layout>
        <TermFiltersForm
          initialValues={{ filters: filters.length ? filters : [{ rules: [{}] }] }}
          onSubmit={this.handleSubmit}
          terms={data.terms}
        />
      </Accordion>
    );
  }
}
