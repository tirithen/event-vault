[![Build Status](https://travis-ci.org/tirithen/event-vault.svg?branch=master)](https://travis-ci.org/tirithen/event-vault)

# EventVault

An Node.js event sourcing package that lets you store events and create projections with an entity tree. Currently this package only supports file system persistance but new persistance adapters can be created by extending the class Persistence. The main target system for this package is currently turn based games but it should be usable for a lot of other systems as well.

See */examples* for examples on how this system could be used.

## When is this package usable?

When you have are creating a system where the entire event history could be kept in memory (persistence is only for restoring). A good usage for this would be for example game servers.

## When should I look for another package?

When you need to save large amounts of events and/or if your system has the need for querying in a projection. A bad usage example for his would be for entire CMS systems.

## Please help out be creating pull-requests!

I will gladly review pull-requests with good test coverage. Let's create an easy to use event sourcing package! :)
