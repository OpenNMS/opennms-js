#!/bin/sh

OWNER=$(find package.json -ls | awk '{ print $5 }')
GROUP=$(find package.json -ls | awk '{ print $6 }')

if [ -n "$OWNER" ] && [ -n "$GROUP" ]; then
	chown -R "${OWNER}:${GROUP}" .
fi
