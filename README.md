# aboxd
[![Build Status](https://travis-ci.org/daniel-lundin/aboxd.svg?branch=master)](https://travis-ci.org/daniel-lundin/aboxd)
[![npm version](https://badge.fury.io/js/aboxd.svg)](https://badge.fury.io/js/aboxd)

Turn comma-separated strings to ascii-charts.

![img](assets/aboxd.gif)

## Examples

`npx aboxd 'left,right'` will yield:

```
┌──────┐   ┌───────┐
│ left │───│ right │
└──────┘   └───────┘
```

`npx aboxd $',top\nbottom-left,bottom-right'` will yield:

```
                  ┌──────────────┐
                  │     top      │
                  └──────────────┘
                         │        
┌─────────────┐   ┌──────────────┐
│ bottom-left │───│ bottom-right │
└─────────────┘   └──────────────┘
```

Use a dot(".") to connect boxes without text:

`npx aboxd $'.,top\nbottom-left,bottom-right'` will yield:

```

                  ┌──────────────┐
       ┌──────────│     top      │
       │          └──────────────┘
       │                 │        
┌─────────────┐   ┌──────────────┐
│ bottom-left │───│ bottom-right │
└─────────────┘   └──────────────┘
```

### From files

aboxd will read from stdin if no arguments are given

Given a file:

```
,Sky
Sweden,Norway
Subway,.
```

`cat file | npx aboxd`

```

             ┌────────┐
             │  Sky   │
             └────────┘
                 │     
┌────────┐   ┌────────┐
│ Sweden │───│ Norway │
└────────┘   └────────┘
    │            │     
┌────────┐       │     
│ Subway │───────┘     
└────────┘             
```

## Vim plugin

Plugin is a stretch, but add this to .vimrc to trigger aboxd on the current selection with `<leader>a`:

```
vnoremap <leader>a :!npx aboxd<CR>
```

## LICENSE

MIT Copyright Daniel Lundin
