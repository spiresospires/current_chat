/*!
 * FusionLive Chat â€“ Ext JS 3.1 Component
 * Renders as an Ext.Panel embeddable in any existing Ext JS 3.x Viewport.
 *
 * Usage (in your legacy app):
 *   var chatPanel = new FusionLive.ChatPanel({ renderTo: 'center-panel' });
 *   // or add it as an item in a border layout / viewport region.
 */

Ext.ns('FusionLive');

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Doc table: Ext.grid.GridPanel
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
FusionLive.DocGrid = Ext.extend(Ext.grid.GridPanel, {

    initComponent: function () {

        var store = new Ext.data.ArrayStore({
            fields: ['ref','title','rev','status','discipline','docType','issueDate','transmittal'],
            data: [
                ['FPU-P-PID-0001','Topsides Gas Compression \u2013 Train A P&ID','C','IFC','Piping','Drawing','07 Apr 2026','TRN-2026-0142'],
                ['FPU-P-PID-0002','Topsides Gas Compression \u2013 Train B P&ID','C','IFC','Piping','Drawing','07 Apr 2026','TRN-2026-0142'],
                ['FPU-P-PID-0003','Topsides Gas Compression \u2013 Train C P&ID','C','IFC','Piping','Drawing','07 Apr 2026','TRN-2026-0142'],
                ['FPU-P-PID-0004','Topsides Gas Compression \u2013 Train D P&ID','C','IFC','Piping','Drawing','07 Apr 2026','TRN-2026-0142'],
                ['FPU-P-PID-0007','HP Flare Header & Knockout Drum','D','IFC','Piping','Drawing','01 Apr 2026','TRN-2026-0138'],
                ['FPU-P-PID-0011','Produced Water Treatment P&ID','B','IFC','Piping','Drawing','28 Mar 2026','TRN-2026-0131'],
                ['FPU-P-PID-0015','Topsides Seawater Lift Pumps','C','IFC','Piping','Drawing','25 Mar 2026','TRN-2026-0129'],
                ['FPU-P-PID-0018','Chemical Injection Skid \u2013 Corrosion Inhibitor','B','IFC','Piping','Drawing','20 Mar 2026','TRN-2026-0124'],
                ['FPU-I-PID-0003','Emergency Shutdown System \u2013 Logic P&ID','C','IFC','Instrumentation','Drawing','14 Mar 2026','TRN-2026-0115']
            ]
        });

        var statusRenderer = function (val) {
            var cls = 'fl-status-ifc';
            if (val === 'AFC') { cls = 'fl-status-afc'; }
            else if (val === 'IFR') { cls = 'fl-status-ifr'; }
            return '<span class="fl-status ' + cls + '">' + Ext.util.Format.htmlEncode(val) + '</span>';
        };

        var cm = new Ext.grid.ColumnModel({
            defaults: { sortable: true },
            columns: [
                { header: 'Document No.',  dataIndex: 'ref',         width: 130,
                  renderer: function (v) { return '<a class="fl-doc-link" href="#">' + Ext.util.Format.htmlEncode(v) + '</a>'; } },
                { id: 'col-title', header: 'Title', dataIndex: 'title', width: 280 },
                { header: 'Rev',           dataIndex: 'rev',         width: 40  },
                { header: 'Status',        dataIndex: 'status',      width: 60,  renderer: statusRenderer },
                { header: 'Discipline',    dataIndex: 'discipline',  width: 110 },
                { header: 'Doc Type',      dataIndex: 'docType',     width: 70  },
                { header: 'Issue Date',    dataIndex: 'issueDate',   width: 90  },
                { header: 'Transmittal',   dataIndex: 'transmittal', width: 120 },
                { header: '',              dataIndex: 'ref',         width: 100, sortable: false,
                  renderer: function () {
                      return '<button class="fl-row-btn" data-row-action="properties" title="Properties">&#9432;</button>' +
                             '<button class="fl-row-btn" data-row-action="view"       title="View">&#128065;</button>' +
                             '<button class="fl-row-btn fl-row-btn-danger" data-row-action="delete" title="Delete">&#128465;</button>';
                  }
                }
            ]
        });

        Ext.apply(this, {
            store:        store,
            cm:           cm,
            stripeRows:   true,
            autoExpandColumn: 'col-title',
            viewConfig:   { forceFit: false, emptyText: 'No documents found.' },
            bbar: new Ext.Toolbar({
                items: [{ xtype: 'tbtext', text: '3 documents have open review comments &nbsp;|&nbsp; Last updated: 13 Apr 2026 09:41' }]
            })
        });

        FusionLive.DocGrid.superclass.initComponent.call(this);
        this.on('cellclick', this.onCellClick, this);
    },

    onCellClick: function (grid, rowIndex, colIndex, e) {
        var target = e.getTarget('[data-row-action]');
        if (!target) { return; }
        var action = target.getAttribute('data-row-action');
        var rec    = grid.getStore().getAt(rowIndex);
        if (!rec) { return; }
        e.stopEvent();

        if (action === 'properties') {
            FusionLive.openDocProps(rec.data);
        } else if (action === 'view') {
            FusionLive.openDocView(rec.data);
        } else if (action === 'delete') {
            Ext.Msg.confirm('Delete Document',
                'Delete &quot;' + Ext.util.Format.htmlEncode(rec.get('ref')) + ' \u2013 ' +
                Ext.util.Format.htmlEncode(rec.get('title')) + '&quot; from results?',
                function (btn) {
                    if (btn === 'yes') { grid.getStore().remove(rec); }
                }
            );
        }
    }
});
Ext.reg('fl-docgrid', FusionLive.DocGrid);


// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Document Properties Window
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
FusionLive.openDocProps = function (doc) {

    var vhStore = new Ext.data.ArrayStore({
        fields: ['ref','title','rev','status','user','company','uploaded','ver','decision'],
        data: [[doc.ref, doc.title, doc.rev, doc.status, 'Spires, Oliver', 'Idox Group', doc.issueDate, '1.0, CURR\u2026', '\u2014']]
    });

    var vhGrid = new Ext.grid.GridPanel({
        store: vhStore,
        stripeRows: true,
        height: 140,
        cm: new Ext.grid.ColumnModel({
            columns: [
                { header: 'Reference',     dataIndex: 'ref',      width: 120 },
                { header: 'Title',         dataIndex: 'title',    width: 220 },
                { header: 'Rev',           dataIndex: 'rev',      width: 36  },
                { header: 'Status',        dataIndex: 'status',   width: 55  },
                { header: 'User',          dataIndex: 'user',     width: 110 },
                { header: 'Company',       dataIndex: 'company',  width: 90  },
                { header: 'Uploaded',      dataIndex: 'uploaded', width: 90  },
                { header: 'Ver.',          dataIndex: 'ver',      width: 80  },
                { header: 'Decision Code', dataIndex: 'decision', width: 80  }
            ]
        }),
        bbar: [{ xtype: 'tbtext', text: 'Displaying 1 - 1 of 1' }]
    });

    var basicForm = new Ext.FormPanel({
        labelWidth: 150,
        bodyStyle:  'padding:8px',
        defaults:   { anchor: '100%' },
        items: [
            { xtype: 'displayfield', fieldLabel: 'Filename',  value: Ext.util.Format.htmlEncode(doc.ref) + '.pdf' },
            { xtype: 'displayfield', fieldLabel: 'Reference', value: Ext.util.Format.htmlEncode(doc.ref) },
            { xtype: 'textfield',    fieldLabel: 'Title',     value: doc.title },
            { xtype: 'combo', fieldLabel: 'Revision',
              store: ['â€”','A','B','C','D'], value: doc.rev,
              triggerAction: 'all', mode: 'local', forceSelection: true, width: 80
            },
            { xtype: 'combo', fieldLabel: 'Reason For Issue',
              store: ['â€”','IFC \u2013 Issued for Construction','AFC \u2013 Approved for Construction',
                      'IFR \u2013 Issued for Review','IFI \u2013 Issued for Information'],
              value: 'IFC \u2013 Issued for Construction',
              triggerAction: 'all', mode: 'local', forceSelection: true, width: 280
            },
            { xtype: 'datefield',    fieldLabel: 'Due Date',  format: 'd M Y', width: 130 },
            { xtype: 'displayfield', fieldLabel: 'PM Status', value: '<b style="color:#2e7d32">' + Ext.util.Format.htmlEncode(doc.status) + '</b>' },
            { xtype: 'displayfield', fieldLabel: 'Category',  value: 'Engineering Document' }
        ]
    });

    var propsPanel = new Ext.Panel({
        layout: 'accordion',
        border: false,
        items: [
            { title: 'Basic Information', layout: 'fit', items: [basicForm], collapsed: false },
            { title: 'Upload Details',    html: '<p style="padding:8px;color:#888">No upload details available.</p>', collapsed: true },
            { title: 'Version History',   layout: 'fit', items: [vhGrid], collapsed: false }
        ]
    });

    var win = new Ext.Window({
        title:     'Document Properties \u2013 ' + Ext.util.Format.htmlEncode(doc.ref),
        width:     780,
        height:    560,
        layout:    'fit',
        modal:     true,
        closable:  true,
        resizable: true,
        items:     [propsPanel],
        buttons: [
            { text: 'Update', handler: function () { win.close(); } },
            { text: 'Close',  handler: function () { win.close(); } }
        ]
    });
    win.show();
};


// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Document View Window (lightbox)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
FusionLive.openDocView = function (doc) {
    var win = new Ext.Window({
        title:     Ext.util.Format.htmlEncode(doc.ref) + ' \u2013 ' + Ext.util.Format.htmlEncode(doc.title),
        width:     720,
        height:    480,
        layout:    'fit',
        modal:     true,
        closable:  true,
        resizable: true,
        html:      '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#aaa;text-align:center;flex-direction:column;">' +
                   '<div style="font-size:48px">&#128196;</div>' +
                   '<p style="font-size:14px;color:#555;margin:12px 0 4px">' + Ext.util.Format.htmlEncode(doc.ref) +
                   '.pdf (Rev ' + Ext.util.Format.htmlEncode(doc.rev) + ')</p>' +
                   '<span style="font-size:11px">PDF / DWG viewer integration point</span></div>',
        buttons: [{ text: 'Close', handler: function () { win.close(); } }]
    });
    win.show();
};


// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// History panel (conversation list)
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
FusionLive.HistoryPanel = Ext.extend(Ext.Panel, {

    histItems: [
        { id: 'h1',  title: 'P&ID IFC Status Query',               date: 'Today, 09:41',     active: true,  pinned: false },
        { id: 'h2',  title: 'FPSO Topsides Drawing Register',      date: 'Today, 08:15',     active: false, pinned: false },
        { id: 'h3',  title: 'HAZOP Action Item Docs',              date: 'Yesterday, 16:30', active: false, pinned: false },
        { id: 'h4',  title: 'Subsea Pipeline Specs Rev D',         date: 'Yesterday, 14:05', active: false, pinned: false },
        { id: 'h5',  title: 'Outstanding RFI List \u2013 Module 3',date: '11 Apr 2026',       active: false, pinned: false },
        { id: 'h6',  title: 'Valve Datasheet Discrepancies',       date: '10 Apr 2026',       active: false, pinned: false },
        { id: 'h7',  title: 'Structural Calc Review Pack',         date: '09 Apr 2026',       active: false, pinned: false },
        { id: 'h8',  title: 'Commissioning Certificate Tracker',   date: '08 Apr 2026',       active: false, pinned: false },
        { id: 'h9',  title: 'As-Built Document Handover',          date: '07 Apr 2026',       active: false, pinned: false },
        { id: 'h10', title: 'Instrument Loop Drawings \u2013 AFC', date: '04 Apr 2026',       active: false, pinned: false },
        { id: 'h11', title: 'Civil Foundations Spec Clash',         date: '03 Apr 2026',       active: false, pinned: false },
        { id: 'h12', title: 'MTO vs BOM Reconciliation',           date: '02 Apr 2026',       active: false, pinned: false }
    ],

    initComponent: function () {
        Ext.apply(this, {
            cls:        'fl-history-panel',
            bodyStyle:  'background:#fff;padding:12px 10px;',
            border:     false,
            autoScroll: true,
            width:      230,
            html:       this.buildHtml()
        });
        this.addEvents('newchat');
        FusionLive.HistoryPanel.superclass.initComponent.call(this);
    },

    buildHtml: function () {
        var hasPinned = false;
        Ext.each(this.histItems, function (i) { if (i.pinned) { hasPinned = true; } });
        var pinnedVisible = hasPinned ? '' : 'display:none';
        var html = '<button class="fl-new-chat-btn" id="fl-new-chat-btn">+ New Chat</button>';
        html += '<div class="fl-section-label" id="fl-pinned-label" style="' + pinnedVisible + '">Pinned</div>';
        Ext.each(this.histItems, function (item) {
            if (item.pinned) { html += this.itemHtml(item); }
        }, this);
        html += '<div class="fl-section-label">Recent</div>';
        Ext.each(this.histItems, function (item) {
            if (!item.pinned) { html += this.itemHtml(item); }
        }, this);
        return html;
    },

    itemHtml: function (item) {
        var activeCls = item.active  ? ' fl-hist-active'  : '';
        var pinnedCls = item.pinned  ? ' fl-hist-pinned'  : '';
        return '<div class="fl-hist-item' + activeCls + pinnedCls + '" data-hist-id="' + item.id + '">' +
               '<div class="fl-hist-title">' + Ext.util.Format.htmlEncode(item.title) + '</div>' +
               '<div class="fl-hist-date">'  + Ext.util.Format.htmlEncode(item.date)  + '</div>' +
               '<button class="fl-hist-menu-btn" title="Options" type="button"><svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3" cy="8" r="1.6"/><circle cx="8" cy="8" r="1.6"/><circle cx="13" cy="8" r="1.6"/></svg></button>' +
               '</div>';
    },

    afterRender: function () {
        FusionLive.HistoryPanel.superclass.afterRender.call(this);
        this.attachEvents();
    },

    attachEvents: function () {
        var el = this.el;
        el.on('click', function () { this.fireEvent('newchat', this); }, this, { delegate: '#fl-new-chat-btn' });

        el.on('click', function (e, t) {
            var item = Ext.fly(t).findParent('.fl-hist-item', null, true);
            if (!item) { return; }
            el.select('.fl-hist-item').removeClass('fl-hist-active');
            item.addClass('fl-hist-active');
        }, this, { delegate: '.fl-hist-title, .fl-hist-date' });

        el.on('click', function (e, t) {
            e.stopEvent();
            this.showItemMenu(e, Ext.fly(t).findParent('.fl-hist-item', null, true));
        }, this, { delegate: '.fl-hist-menu-btn' });
    },

    showItemMenu: function (e, itemEl) {
        if (!itemEl) { return; }
        var me = this;
        var isPinned = itemEl.hasClass('fl-hist-pinned');
        var menu = new Ext.menu.Menu({
            items: [
                { text: 'Rename', handler: function () { me.renameItem(itemEl); } },
                { text: isPinned ? 'Unpin' : 'Pin to top', handler: function () { me.togglePin(itemEl); } },
                '-',
                { text: 'Delete', cls: 'fl-menu-danger', handler: function () { me.deleteItem(itemEl); } }
            ]
        });
        menu.showAt(e.getXY());
    },

    renameItem: function (itemEl) {
        var titleEl = itemEl.child('.fl-hist-title');
        var current = titleEl.dom.textContent || titleEl.dom.innerText || '';
        current = current.trim();
        Ext.Msg.prompt('Rename', 'Enter new name:', function (btn, val) {
            if (btn === 'ok' && val.trim()) {
                titleEl.update(Ext.util.Format.htmlEncode(val.trim()));
            }
        }, this, false, current);
    },

    togglePin: function (itemEl) {
        var pinnedLabel = this.el.child('#fl-pinned-label');
        if (itemEl.hasClass('fl-hist-pinned')) {
            itemEl.removeClass('fl-hist-pinned');
            var recentLabel = this.el.select('.fl-section-label').last();
            recentLabel.insertSibling(itemEl, 'after');
        } else {
            itemEl.addClass('fl-hist-pinned');
            pinnedLabel.setStyle('display', '');
            pinnedLabel.insertSibling(itemEl, 'after');
        }
        if (this.el.select('.fl-hist-pinned').getCount() === 0) {
            pinnedLabel.setStyle('display', 'none');
        }
    },

    deleteItem: function (itemEl) {
        var titleEl = itemEl.child('.fl-hist-title');
        var title   = titleEl.dom.textContent || titleEl.dom.innerText || '';
        Ext.Msg.confirm('Delete', 'Delete conversation &quot;' + Ext.util.Format.htmlEncode(title.trim()) + '&quot;?', function (btn) {
            if (btn === 'yes') {
                itemEl.remove();
                if (this.el.select('.fl-hist-pinned').getCount() === 0) {
                    var lbl = this.el.child('#fl-pinned-label');
                    if (lbl) { lbl.setStyle('display', 'none'); }
                }
            }
        }, this);
    }
});
Ext.reg('fl-historypanel', FusionLive.HistoryPanel);


// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Messages panel
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
FusionLive.MessagesPanel = Ext.extend(Ext.Panel, {

    initialHtml: [
        '<div class="fl-msg fl-msg-user">',
        '  <div class="fl-msg-label">You</div>',
        '  <div class="fl-bubble">Show me all P&amp;ID documents currently at IFC status for the FPSO Topsides package, and summarise any outstanding review comments.</div>',
        '</div>',
        '<div class="fl-msg fl-msg-bot">',
        '  <div class="fl-msg-label">FusionLive AI</div>',
        '  <div class="fl-bubble">',
        '    <span class="fl-reasoning-tag">&#9432; Reasoning</span>',
        '    <div class="fl-resp-summary">',
        '      I found <strong>9 P&amp;ID documents</strong> at <strong>Issued for Construction (IFC)</strong> status within the',
        '      <strong>FPSO Topsides</strong> package. Of these, <strong>3 documents</strong> have open review comments.',
        '      The most recent transmittal (TRN-2026-0142) issued on <strong>07 Apr 2026</strong> covered 4 drawings;',
        '      two carry Contractor comments at Category B (minor) that require disposition before the next revision uplift.',
        '      No Category A (hold) comments are currently open.',
        '    </div>',
        '    <div class="fl-doc-links">',
        '      <div class="fl-doc-links-label">Matching documents (9)</div>',
        '      <ul class="fl-doc-list">',
        '        <li><a class="fl-doc-link" href="#">FPU-P-PID-0001</a> &ndash; Topsides Gas Compression &ndash; Train A P&amp;ID <span class="fl-status fl-status-ifc">IFC</span></li>',
        '        <li><a class="fl-doc-link" href="#">FPU-P-PID-0002</a> &ndash; Topsides Gas Compression &ndash; Train B P&amp;ID <span class="fl-status fl-status-ifc">IFC</span></li>',
        '        <li><a class="fl-doc-link" href="#">FPU-P-PID-0003</a> &ndash; Topsides Gas Compression &ndash; Train C P&amp;ID <span class="fl-status fl-status-ifc">IFC</span></li>',
        '        <li><a class="fl-doc-link" href="#">FPU-P-PID-0004</a> &ndash; Topsides Gas Compression &ndash; Train D P&amp;ID <span class="fl-status fl-status-ifc">IFC</span></li>',
        '        <li><a class="fl-doc-link" href="#">FPU-P-PID-0007</a> &ndash; HP Flare Header &amp; Knockout Drum <span class="fl-status fl-status-ifc">IFC</span></li>',
        '        <li><a class="fl-doc-link" href="#">FPU-P-PID-0011</a> &ndash; Produced Water Treatment P&amp;ID <span class="fl-status fl-status-ifc">IFC</span></li>',
        '        <li><a class="fl-doc-link" href="#">FPU-P-PID-0015</a> &ndash; Topsides Seawater Lift Pumps <span class="fl-status fl-status-ifc">IFC</span></li>',
        '        <li><a class="fl-doc-link" href="#">FPU-P-PID-0018</a> &ndash; Chemical Injection Skid &ndash; Corrosion Inhibitor <span class="fl-status fl-status-ifc">IFC</span></li>',
        '        <li><a class="fl-doc-link" href="#">FPU-I-PID-0003</a> &ndash; Emergency Shutdown System &ndash; Logic P&amp;ID <span class="fl-status fl-status-ifc">IFC</span></li>',
        '      </ul>',
        '      <div class="fl-grid-footer">3 documents have open review comments &nbsp;&bull;&nbsp; Last updated: 13 Apr 2026 09:41</div>',
        '    </div>',
        '  </div>',
        '</div>'
    ].join(''),

    initComponent: function () {
        Ext.apply(this, {
            cls:        'fl-messages-area',
            bodyStyle:  'padding:24px 28px 130px;background:#f8f9fb;',
            border:     false,
            autoScroll: true,
            html:       this.initialHtml
        });
        FusionLive.MessagesPanel.superclass.initComponent.call(this);
    },

    appendUserMessage: function (text) {
        this.el.createChild({
            tag: 'div',
            html: '<div class="fl-msg fl-msg-user">' +
                  '<div class="fl-msg-label">You</div>' +
                  '<div class="fl-bubble">' + Ext.util.Format.htmlEncode(text) + '</div>' +
                  '</div>'
        });
        this.el.dom.scrollTop = this.el.dom.scrollHeight;
    },

    appendThinking: function (withReasoning) {
        var inner = (withReasoning ? '<span class="fl-reasoning-tag">&#9432; Reasoning\u2026</span><br>' : '') +
                    '<span style="color:#aaa;font-style:italic">Searching documents and metadata\u2026</span>';
        this.el.createChild({
            tag: 'div',
            html: '<div class="fl-msg fl-msg-bot" id="fl-thinking-msg">' +
                  '<div class="fl-msg-label">FusionLive AI</div>' +
                  '<div class="fl-bubble">' + inner + '</div>' +
                  '</div>'
        });
        this.el.dom.scrollTop = this.el.dom.scrollHeight;
    },

    reset: function () {
        this.el.update(this.initialHtml);
    }
});
Ext.reg('fl-messagespanel', FusionLive.MessagesPanel);


// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Input panel
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
FusionLive.InputPanel = Ext.extend(Ext.Panel, {

    initComponent: function () {
        Ext.apply(this, {
            cls:    'fl-input-area',
            border: false,
            html: [
                '<div class="fl-input-options">',
                '  <label class="fl-opt-label"><input type="checkbox" id="fl-reasoning-cb" checked> Reasoning</label>',
                '  <span class="fl-opt-hint">Enables deeper analysis &mdash; may take a few seconds longer</span>',
                '</div>',
                '<div class="fl-input-box">',
                '  <table class="fl-input-table"><tr>',
                '    <td class="fl-input-td">',
                '      <textarea id="fl-chat-textarea" rows="1" placeholder="Ask a question about your documents, transmittals, or metadata\u2026"></textarea>',
                '    </td>',
                '    <td class="fl-btn-td">',
                '      <div id="fl-send-btn" role="button" tabindex="0" title="Send"' +
                '           style="display:inline-block;width:34px;height:34px;background:#002060;border-radius:8px;cursor:pointer;vertical-align:middle;text-align:center;line-height:30px">' ,
                '        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" style="vertical-align:middle">',
                '          <line x1="22" y1="2" x2="11" y2="13"/>',
                '          <polygon points="22 2 15 22 11 13 2 9 22 2" fill="#fff"/>',
                '        </svg>',
                '      </div>',
                '    </td>',
                '  </tr></table>',
                '</div>',
                '<div class="fl-disclaimer">FusionLive AI can make mistakes. Always verify results against source documents.</div>'
            ].join('')
        });
        this.addEvents('send');
        FusionLive.InputPanel.superclass.initComponent.call(this);
    },

    afterRender: function () {
        FusionLive.InputPanel.superclass.afterRender.call(this);
        // Ensure Ext JS panel body doesn't clip the absolutely-positioned send button
        this.body.setStyle('overflow', 'visible');
        var me       = this;
        this.textarea = document.getElementById('fl-chat-textarea');
        this.sendBtnEl = document.getElementById('fl-send-btn');
        this.reasoningEl = document.getElementById('fl-reasoning-cb');

        // Auto-grow textarea
        Ext.fly(this.textarea).on('input', function () {
            me.textarea.style.height = 'auto';
            me.textarea.style.height = Math.min(me.textarea.scrollHeight, 160) + 'px';
        });

        // Enter to send, Shift+Enter for newline
        Ext.fly(this.textarea).on('keydown', function (e) {
            if (e.getKey() === e.ENTER && !e.shiftKey) {
                e.stopEvent();
                me.fireEvent('send', me);
            }
        });

        Ext.fly(this.sendBtnEl).on('click', function () {
            me.fireEvent('send', me);
        });
        Ext.fly(this.sendBtnEl).on('keydown', function (e) {
            if (e.getKey() === e.ENTER || e.getKey() === e.SPACE) {
                e.stopEvent();
                me.fireEvent('send', me);
            }
        });
        // hover effect
        Ext.fly(this.sendBtnEl).on('mouseover', function () { this.setStyle('background', '#003399'); }, Ext.fly(this.sendBtnEl));
        Ext.fly(this.sendBtnEl).on('mouseout',  function () { this.setStyle('background', '#002060'); }, Ext.fly(this.sendBtnEl));
    },

    getText:      function () { return this.textarea ? this.textarea.value : ''; },
    clear:        function () {
        if (this.textarea) {
            this.textarea.value = '';
            this.textarea.style.height = 'auto';
            this.textarea.focus();
        }
    },
    useReasoning: function () { return this.reasoningEl ? this.reasoningEl.checked : true; }
});
Ext.reg('fl-inputpanel', FusionLive.InputPanel);


// RightPanel: wraps messages (center) + input (south) so the splitter
// only divides the history sidebar from the full chat column.
FusionLive.RightPanel = Ext.extend(Ext.Panel, {

    layout: 'fit',
    border: false,
    cls:    'fl-right-panel',

    initComponent: function () {
        this.messagesPanel = new FusionLive.MessagesPanel({});

        Ext.apply(this, { items: [this.messagesPanel] });
        FusionLive.RightPanel.superclass.initComponent.call(this);
    },

    afterRender: function () {
        FusionLive.RightPanel.superclass.afterRender.call(this);
        this.body.setStyle('position', 'relative');
        var inputEl = document.getElementById('fl-input-area');
        if (inputEl && inputEl.parentNode !== this.body.dom) {
            this.body.dom.appendChild(inputEl);
        }
    },

    appendUserMessage: function (text) { this.messagesPanel.appendUserMessage(text); },
    appendThinking:    function (r)    { this.messagesPanel.appendThinking(r); },
    reset:             function ()     { this.messagesPanel.reset(); }
});
Ext.reg('fl-rightpanel', FusionLive.RightPanel);


// ChatPanel: history west (draggable splitter) + right panel center
FusionLive.ChatPanel = Ext.extend(Ext.Panel, {

    layout: 'border',
    border: false,
    cls:    'fl-chat-panel',

    initComponent: function () {
        this.historyPanel = new FusionLive.HistoryPanel({
            region:   'west',
            width:     230,
            minWidth:  160,
            maxWidth:  420,
            split:     true
        });
        this.rightPanel = new FusionLive.RightPanel({ region: 'center' });

        Ext.apply(this, { items: [this.historyPanel, this.rightPanel] });
        FusionLive.ChatPanel.superclass.initComponent.call(this);
        this.historyPanel.on('newchat', this.onNewChat, this);
    },

    onNewChat: function () {
        this.rightPanel.reset();
    }
});
Ext.reg('fl-chatpanel', FusionLive.ChatPanel);


// Bootstrap
Ext.onReady(function () {

    Ext.select('.nav-tab').on('click', function (e, t) {
        e.preventDefault();
        Ext.select('.nav-tab').removeClass('active');
        Ext.fly(t).addClass('active');
    });

    if (Ext.get('fl-chat-container')) {
        var ct   = Ext.get('fl-chat-container');
        var chat = new FusionLive.ChatPanel({
            renderTo: ct,
            width:    ct.getWidth(),
            height:   ct.getHeight()
        });
        Ext.EventManager.onWindowResize(function () {
            chat.setSize(ct.getWidth(), ct.getHeight());
        });

        // ── Plain-JS input wiring (outside Ext JS panel system) ──────────
        var textarea  = document.getElementById('fl-chat-textarea');
        var sendBtn   = document.getElementById('fl-send-btn');
        var reasonCb  = document.getElementById('fl-reasoning-cb');

        function sendMessage() {
            var text = textarea.value.trim();
            if (!text) { return; }
            chat.rightPanel.appendUserMessage(text);
            textarea.value = '';
            textarea.style.height = 'auto';
            textarea.focus();
            var useReasoning = reasonCb ? reasonCb.checked : true;
            setTimeout(function () { chat.rightPanel.appendThinking(useReasoning); }, 400);
        }

        textarea.addEventListener('input', function () {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px';
        });
        textarea.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        sendBtn.addEventListener('click', sendMessage);
    }
});

