import type {StructureResolver} from 'sanity/structure'
import {CogIcon, DocumentsIcon, ComponentIcon, ArchiveIcon, CheckmarkCircleIcon, CloseCircleIcon, TagIcon} from '@sanity/icons'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Penn Rock Admin')
    .items([
      // 1. ALL MASTER INVENTORY (Trucks + Parts)
      S.listItem()
        .title('All Master Inventory')
        .icon(ArchiveIcon)
        .child(
          S.documentList()
            .title('All Inventory')
            .filter('_type in ["inventory", "part"]')
        ),

      S.divider(),

      // 2. TRUCKS & EQUIPMENT FOLDER
      S.listItem()
        .title('Trucks & Equipment')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('Trucks & Equipment')
            .items([
              S.listItem()
                .title('All Trucks (Filterable)')
                .icon(DocumentsIcon)
                .child(
                  S.documentList()
                    .title('All Trucks')
                    .filter('_type == "inventory"')
                ),
              S.listItem()
                .title('Active Trucks')
                .icon(CheckmarkCircleIcon)
                .child(
                  S.documentList()
                    .title('Active Trucks')
                    .filter('_type == "inventory" && status != "sold"')
                ),
              S.listItem()
                .title('Sold Trucks')
                .icon(CloseCircleIcon)
                .child(
                  S.documentList()
                    .title('Sold Trucks')
                    .filter('_type == "inventory" && status == "sold"')
                ),

            ])
        ),

      // 3. PARTS DEPARTMENT FOLDER
      S.listItem()
        .title('Parts Department')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Parts Department')
            .items([
              S.listItem()
                .title('All Parts (Filterable)')
                .icon(ComponentIcon)
                .child(
                  S.documentList()
                    .title('All Parts')
                    .filter('_type == "part"')
                ),
              S.listItem()
                .title('Available Parts')
                .icon(CheckmarkCircleIcon)
                .child(
                  S.documentList()
                    .title('Available Parts')
                    .filter('_type == "part" && status == "available"')
                ),
              S.listItem()
                .title('Out of Stock / Sold')
                .icon(CloseCircleIcon)
                .child(
                  S.documentList()
                    .title('Out of Stock / Sold')
                    .filter('_type == "part" && status in ["sold", "out-of-stock"]')
                ),

            ])
        ),
    ])