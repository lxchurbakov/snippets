import React from 'react';
import styled from 'styled-components';

import { Text } from '/src/libs/atoms';
import { colors } from '/src/libs/theme';

const TableWrap = styled.table`
    width: 100%;
    padding: 0;
    border: 0;
    border-collapse: collapse;
`;

const TableHead = styled.thead`
    width: 100%;
`;

const TableHeadRow = styled.tr`
    width: 100%;
`;

const TableHeadItem = styled.td`
    width: 100%;
    padding: 0;
    border: 0;
`;

const TableBody = styled.tbody`
    width: 100%;    
`;

const TableBodyRow = styled.tr`
    width: 100%;
    margin-bottom: 4px;
`;

const TableBodyItem = styled.td`
    width: 100%;
    padding: 0;
    border: 0;
`;

export const Table = ({ columns, rows }) => {
    return rows.length > 0 ? (
        <TableWrap cellpadding="0" cellspacing="0">
            <TableHead>
                <TableHeadRow>
                    {columns.map((column) => (
                        <TableHeadItem key={column.key}>
                            <Text color={colors.grey} size="13px" weight="800">{column.title}</Text>
                        </TableHeadItem>
                    ))}
                </TableHeadRow>
            </TableHead>

            <TableBody>
                {rows.map((row) => (
                    <TableBodyRow key={row.id}>
                        {columns.map((column) => (
                            <TableBodyItem key={column.key}>
                                <Text size="14px">{column.render ? column.render(row) : row[column.key]}</Text>
                            </TableBodyItem>
                        ))}
                    </TableBodyRow>
                ))}
            </TableBody>
        </TableWrap>
    ) : null;
};