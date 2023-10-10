import React from 'react';

import { useAsyncMemo, useInput, useField } from '/libs/hooks';
import { useApi } from '/api';

const Pagination = ({ count, page, size, onChangePage }) => {
    const pages = React.useMemo(() => [
        0,
        page - 50,
        page - 20,
        page - 10,
        page - 5,
        page - 2,
        page - 1,
        page,
        page + 1,
        page + 2,
        page + 5,
        page + 10,
        page + 20,
        page + 50,
        Math.ceil(count / size),
    ].filter(($) => $ >= 0 && $ <= Math.ceil(count / size)), [count, size, page]);

    return (
        <Flex gap="8px">
            {pages.map((page) => (
                <Clickable onClick={() => onChangePage(page)} w="48px" h="48px" color="black" radius="4px">
                    <Flex w="100%" h="100%">
                        <Text>{page}</Text>
                    </Flex>
                </Clickable>
            ))}
        </Flex>
    );
};

const Form = ({ value, onChange, onSubmit, ...props }) => {
    const name = useInput(useField(value, 'name', ''));

    return (
        <Base {...props}>
            <TextInput mb="24px" {...name} placeholder="Name" />

            <Button onClick={onSubmit}>Submit</Button>
        </Base>
    );
};

const Table = ({ values, ...props }: { values: Entity[] } & BaseProps) => {
    const columns = [
        { title: 'Id', key: 'id' },
    ];

    return (
        <TableWrap {...props}>
            <TableHead>
                {columns.map((column) => (
                    <TableCell key={column.key}>
                        <Text>{column.title}</Text>
                    </TableCell>
                ))}
            </TableHead>

            <TableBody>
                {values.map((value) => (
                    <TableRow key={value.id}>
                        {columns.map((column) => (
                            <TableCell key={column.key}>
                                <Text>{value[column.key]}</Text>
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </TableWrap>
    );
};

export default () => {
    const api = useApi();
    const [pagination, setPagination] = React.useState({ page: 0, size: 10 });
    const [values, setValues] = useAsyncMemo(() => api.whatever.get(pagination), [pagination]);

    const whatever = useInput();

    return (
        <Base>
            <Table values={values} mb="64px" />

            <Form {...whatever} />
        </Base>
    );
};
