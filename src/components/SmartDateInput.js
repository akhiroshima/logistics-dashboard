import React, { useState, useEffect, useRef } from 'react';
import { AutoComplete, Input, Tag, Tooltip } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';

dayjs.extend(quarterOfYear);

const SmartDateInput = ({ value, onChange, placeholder = "Type: Q1 2023, Last Quarter, 2024..." }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSelections, setRecentSelections] = useState([]);
  const inputRef = useRef(null);

  // Initialize input value from props
  useEffect(() => {
    if (value && value.length === 2) {
      const displayText = formatDateRangeDisplay(value[0], value[1]);
      setInputValue(displayText);
    }
  }, [value]);

  // Smart date parsing patterns
  const parseSmartDate = (input) => {
    const cleanInput = input.toLowerCase().trim();
    const currentYear = dayjs().year();
    const today = dayjs();

    // Year patterns
    if (/^\d{4}$/.test(cleanInput)) {
      const year = parseInt(cleanInput);
      return {
        start: `${year}-01-01`,
        end: `${year}-12-31`,
        label: `${year}`,
        type: 'year'
      };
    }

    // Quarter patterns (Q1, Q1 2023, Quarter 1, etc.)
    const quarterMatch = cleanInput.match(/q(\d)[,\s]*(\d{4})?|quarter\s*(\d)[,\s]*(\d{4})?/);
    if (quarterMatch) {
      const quarter = parseInt(quarterMatch[1] || quarterMatch[3]);
      const year = parseInt(quarterMatch[2] || quarterMatch[4] || currentYear);
      
      if (quarter >= 1 && quarter <= 4) {
        const startMonth = (quarter - 1) * 3 + 1;
        const endMonth = quarter * 3;
        const start = dayjs(`${year}-${startMonth.toString().padStart(2, '0')}-01`);
        const end = start.add(2, 'month').endOf('month');
        
        return {
          start: start.format('YYYY-MM-DD'),
          end: end.format('YYYY-MM-DD'),
          label: `Q${quarter} ${year}`,
          type: 'quarter'
        };
      }
    }

    // Month patterns (March, Mar 2023, 03 2023, etc.)
    const monthMatch = cleanInput.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december|\d{1,2})[,\s]*(\d{4})?/);
    if (monthMatch) {
      const monthInput = monthMatch[1];
      const year = parseInt(monthMatch[2] || currentYear);
      
      let month;
      if (/^\d+$/.test(monthInput)) {
        month = parseInt(monthInput);
      } else {
        const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        month = monthNames.findIndex(m => monthInput.startsWith(m)) + 1;
      }
      
      if (month >= 1 && month <= 12) {
        const start = dayjs(`${year}-${month.toString().padStart(2, '0')}-01`);
        const end = start.endOf('month');
        
        return {
          start: start.format('YYYY-MM-DD'),
          end: end.format('YYYY-MM-DD'),
          label: start.format('MMM YYYY'),
          type: 'month'
        };
      }
    }

    // Relative date patterns
    const relativePatterns = {
      'this year': () => ({
        start: today.startOf('year').format('YYYY-MM-DD'),
        end: today.endOf('year').format('YYYY-MM-DD'),
        label: 'This Year',
        type: 'relative'
      }),
      'last year': () => ({
        start: today.subtract(1, 'year').startOf('year').format('YYYY-MM-DD'),
        end: today.subtract(1, 'year').endOf('year').format('YYYY-MM-DD'),
        label: 'Last Year',
        type: 'relative'
      }),
      'this quarter': () => ({
        start: today.startOf('quarter').format('YYYY-MM-DD'),
        end: today.endOf('quarter').format('YYYY-MM-DD'),
        label: 'This Quarter',
        type: 'relative'
      }),
      'last quarter': () => ({
        start: today.subtract(1, 'quarter').startOf('quarter').format('YYYY-MM-DD'),
        end: today.subtract(1, 'quarter').endOf('quarter').format('YYYY-MM-DD'),
        label: 'Last Quarter',
        type: 'relative'
      }),
      'this month': () => ({
        start: today.startOf('month').format('YYYY-MM-DD'),
        end: today.endOf('month').format('YYYY-MM-DD'),
        label: 'This Month',
        type: 'relative'
      }),
      'last month': () => ({
        start: today.subtract(1, 'month').startOf('month').format('YYYY-MM-DD'),
        end: today.subtract(1, 'month').endOf('month').format('YYYY-MM-DD'),
        label: 'Last Month',
        type: 'relative'
      }),
      'ytd': () => ({
        start: today.startOf('year').format('YYYY-MM-DD'),
        end: today.format('YYYY-MM-DD'),
        label: 'Year to Date',
        type: 'relative'
      }),
      'last 30 days': () => ({
        start: today.subtract(30, 'day').format('YYYY-MM-DD'),
        end: today.format('YYYY-MM-DD'),
        label: 'Last 30 Days',
        type: 'relative'
      }),
      'last 90 days': () => ({
        start: today.subtract(90, 'day').format('YYYY-MM-DD'),
        end: today.format('YYYY-MM-DD'),
        label: 'Last 90 Days',
        type: 'relative'
      })
    };

    for (const [pattern, fn] of Object.entries(relativePatterns)) {
      if (cleanInput.includes(pattern)) {
        return fn();
      }
    }

    return null;
  };

  // Generate smart suggestions based on input
  const generateSuggestions = (searchText) => {
    const suggestions = [];
    const cleanText = searchText.toLowerCase().trim();

    if (!cleanText) {
      // Show recent selections and common presets when empty
      const presets = [
        'This Quarter',
        'Last Quarter', 
        'This Year',
        'Last Year',
        'YTD',
        'Last 30 Days'
      ];
      
      return [
        ...recentSelections.slice(0, 3).map(item => ({
          value: item.label,
          label: (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span><ClockCircleOutlined style={{ marginRight: 8, color: '#666' }} />{item.label}</span>
              <Tag size="small" color="blue">Recent</Tag>
            </div>
          ),
          data: item
        })),
        ...presets.map(preset => {
          const parsed = parseSmartDate(preset);
          return parsed ? {
            value: preset,
            label: (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><TrophyOutlined style={{ marginRight: 8, color: '#52c41a' }} />{preset}</span>
                <Tag size="small" color="green">Preset</Tag>
              </div>
            ),
            data: parsed
          } : null;
        }).filter(Boolean)
      ];
    }

    // Pattern-based suggestions
    if (cleanText.startsWith('q') || cleanText.includes('quarter')) {
      // Quarter suggestions
      const currentYear = dayjs().year();
      for (let year = currentYear - 1; year <= currentYear + 1; year++) {
        for (let q = 1; q <= 4; q++) {
          const suggestion = `Q${q} ${year}`;
          if (suggestion.toLowerCase().includes(cleanText)) {
            const parsed = parseSmartDate(suggestion);
            if (parsed) {
              suggestions.push({
                value: suggestion,
                label: (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>📅 {suggestion}</span>
                    <span style={{ fontSize: '12px', color: '#666' }}>
                      {dayjs(parsed.start).format('MMM DD')} - {dayjs(parsed.end).format('MMM DD')}
                    </span>
                  </div>
                ),
                data: parsed
              });
            }
          }
        }
      }
    }

    if (/^\d/.test(cleanText)) {
      // Year suggestions
      const currentYear = dayjs().year();
      for (let year = currentYear - 2; year <= currentYear + 2; year++) {
        const yearStr = year.toString();
        if (yearStr.includes(cleanText)) {
          suggestions.push({
            value: yearStr,
            label: (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>📅 {yearStr}</span>
                <span style={{ fontSize: '12px', color: '#666' }}>Full Year</span>
              </div>
            ),
            data: parseSmartDate(yearStr)
          });
        }
      }
    }

    if (cleanText.includes('last') || cleanText.includes('this') || cleanText.includes('ytd')) {
      // Relative date suggestions
      const relatives = [
        'This Year', 'Last Year', 'This Quarter', 'Last Quarter',
        'This Month', 'Last Month', 'YTD', 'Last 30 Days', 'Last 90 Days'
      ];
      
      relatives.forEach(rel => {
        if (rel.toLowerCase().includes(cleanText)) {
          const parsed = parseSmartDate(rel);
          if (parsed) {
            suggestions.push({
              value: rel,
              label: (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>⏰ {rel}</span>
                  <span style={{ fontSize: '12px', color: '#666' }}>
                    {dayjs(parsed.start).format('MMM DD')} - {dayjs(parsed.end).format('MMM DD')}
                  </span>
                </div>
              ),
              data: parsed
            });
          }
        }
      });
    }

    // Try to parse current input
    const directParse = parseSmartDate(cleanText);
    if (directParse && !suggestions.some(s => s.data && s.data.label === directParse.label)) {
      suggestions.unshift({
        value: directParse.label,
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>✨ {directParse.label}</span>
            <Tag size="small" color="orange">Parsed</Tag>
          </div>
        ),
        data: directParse
      });
    }

    return suggestions.slice(0, 8); // Limit suggestions
  };

  const formatDateRangeDisplay = (start, end) => {
    const startDate = dayjs(start);
    const endDate = dayjs(end);
    
    // Check if it's a full year
    if (startDate.format('MM-DD') === '01-01' && endDate.format('MM-DD') === '12-31' && startDate.year() === endDate.year()) {
      return startDate.format('YYYY');
    }
    
    // Check if it's a quarter
    const quarter = Math.ceil(startDate.month() / 3);
    const quarterStart = dayjs().year(startDate.year()).quarter(quarter).startOf('quarter');
    const quarterEnd = dayjs().year(startDate.year()).quarter(quarter).endOf('quarter');
    
    if (startDate.isSame(quarterStart, 'day') && endDate.isSame(quarterEnd, 'day')) {
      return `Q${quarter} ${startDate.year()}`;
    }
    
    // Check if it's a full month
    if (startDate.date() === 1 && endDate.isSame(startDate.endOf('month'), 'day')) {
      return startDate.format('MMM YYYY');
    }
    
    // Default range format
    if (startDate.isSame(endDate, 'day')) {
      return startDate.format('MMM DD, YYYY');
    }
    
    return `${startDate.format('MMM DD')} - ${endDate.format('MMM DD, YYYY')}`;
  };

  const handleSearch = (searchText) => {
    setInputValue(searchText);
    const newSuggestions = generateSuggestions(searchText);
    setSuggestions(newSuggestions);
  };

  const handleSelect = (value, option) => {
    const selectedData = option.data;
    if (selectedData) {
      setInputValue(selectedData.label);
      onChange([selectedData.start, selectedData.end], selectedData.label);
      
      // Add to recent selections
      const newRecent = [selectedData, ...recentSelections.filter(r => r.label !== selectedData.label)].slice(0, 5);
      setRecentSelections(newRecent);
    }
  };

  const handlePressEnter = () => {
    const parsed = parseSmartDate(inputValue);
    if (parsed) {
      onChange([parsed.start, parsed.end], parsed.label);
      setInputValue(parsed.label);
      
      // Add to recent selections
      const newRecent = [parsed, ...recentSelections.filter(r => r.label !== parsed.label)].slice(0, 5);
      setRecentSelections(newRecent);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <AutoComplete
        ref={inputRef}
        value={inputValue}
        options={suggestions}
        onSearch={handleSearch}
        onSelect={handleSelect}
        placeholder={placeholder}
        style={{ width: '250px' }}
        allowClear
        dropdownMatchSelectWidth={300}
      >
        <Input
          prefix={<CalendarOutlined style={{ color: '#1890ff' }} />}
          onPressEnter={handlePressEnter}
          style={{ 
            borderRadius: '6px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        />
      </AutoComplete>
      
      {inputValue && (
        <Tooltip title="Press Enter to apply or select from suggestions">
          <div style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '12px',
            color: '#666',
            pointerEvents: 'none'
          }}>
            ⏎
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default SmartDateInput;
