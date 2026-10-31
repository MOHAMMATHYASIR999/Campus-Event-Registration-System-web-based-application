import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  Share2,
  Copy,
  Check,
  QrCode,
  Download,
  ExternalLink,
  Users,
  Sparkles,
  MessageSquare,
  Send,
  RefreshCw,
  Link as LinkIcon,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const InviteShareSection: React.FC = () => {
  const { addToast } = useApp();

  // Public shared production app URL
  const publicBaseUrl = 'https://ais-pre-zehlft6mm425e7heo4lmhh-843781378685.asia-southeast1.run.app';

  // State
  const [selectedDestination, setSelectedDestination] = useState<'home' | 'events' | 'registration'>('home');
  const [referralToken, setReferralToken] = useState<string>(() => Math.floor(1000 + Math.random() * 9000).toString());
  const [inviteUrl, setInviteUrl] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Generate URL based on selected destination and referral token
  const buildUrl = (dest: 'home' | 'events' | 'registration', token: string) => {
    let path = publicBaseUrl;
    if (dest === 'events') {
      path += '/?view=events';
    } else if (dest === 'registration') {
      path += '/?view=registration';
    }

    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}invite=campus2026&ref=std_${token}`;
  };

  const generateQrForUrl = async (url: string) => {
    try {
      const qr = await QRCode.toDataURL(url, {
        width: 480,
        margin: 1,
        errorCorrectionLevel: 'H',
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      });
      setQrCodeUrl(qr);
    } catch (err) {
      console.error('Failed to generate invite QR code:', err);
    }
  };

  useEffect(() => {
    const url = buildUrl(selectedDestination, referralToken);
    setInviteUrl(url);
    generateQrForUrl(url);
  }, [selectedDestination, referralToken]);

  // Handle regenerating a new invite link and QR code
  const handleRegenerateLink = () => {
    setIsRegenerating(true);
    const newToken = Math.floor(1000 + Math.random() * 9000).toString();
    setReferralToken(newToken);
    const newUrl = buildUrl(selectedDestination, newToken);
    setInviteUrl(newUrl);

    generateQrForUrl(newUrl).finally(() => {
      setTimeout(() => {
        setIsRegenerating(false);
        addToast(
          'Invite Link & QR Code Regenerated!',
          'A fresh student invitation URL and high-res QR code have been generated.',
          'success'
        );
      }, 350);
    });
  };

  const inviteMessage = `🎓 Join me at the Campus Mega Events 2026 (Nov 21 & Nov 22, Near Central Auditorium)! 8 Flagship Events with Hackathons, Cultural Competitions, Sports, and Tech Workshops. Register early before the 100-seat limit per event fills up: ${inviteUrl}`;

  const handleCopyLink = () => {
    if (!inviteUrl) return;
    navigator.clipboard?.writeText(inviteUrl);
    setCopiedLink(true);
    addToast('Link Copied!', 'Student invite link copied to clipboard.', 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyMessage = () => {
    navigator.clipboard?.writeText(inviteMessage);
    setCopiedMessage(true);
    addToast('Message Copied!', 'Full campus invitation text copied to clipboard.', 'success');
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Campus Mega Events 2026 - Register & Get Digital Pass',
          text: 'Register for 8 upcoming campus events on Nov 21 & 22 (Near Central Auditorium). Reserve your seat now!',
          url: inviteUrl,
        });
        addToast('Shared Successfully', 'Thank you for inviting friends!', 'success');
      } catch {
        // User cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  const handleDownloadQr = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `Campus-Events-Invite-QR-${referralToken}.png`;
    link.click();
    addToast('QR Code Saved', 'Invitation QR Code image downloaded.', 'success');
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(inviteMessage)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTelegramShare = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${encodeURIComponent(
      'Join Campus Mega Events 2026! Reserve your seat & get your digital pass.'
    )}`;
    window.open(tgUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-slate-800/60 shadow-2xl relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-5xl mx-auto space-y-8">
        {/* Header Kicker & Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-600/20 text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-500/30">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Invite Fellow Students & Friends</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Share Campus Events & Invite Your Friends
            </h2>
            <p className="text-xs sm:text-sm text-teal-100/80 max-w-xl leading-relaxed">
              Help your friends and batchmates register before the 100-seat limit per event is reached. Share the web link directly or scan the live QR code on mobile.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-teal-300 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl shrink-0 self-start md:self-auto">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>8 Mega Events · 800 Total Seats</span>
          </div>
        </div>

        {/* Link Destination Selector Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs font-semibold text-teal-100">
              Select Link Destination:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/60 p-1 rounded-xl border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setSelectedDestination('home')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedDestination === 'home'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Main Portal Home
            </button>
            <button
              type="button"
              onClick={() => setSelectedDestination('events')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedDestination === 'events'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All 8 Events Roster
            </button>
            <button
              type="button"
              onClick={() => setSelectedDestination('registration')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedDestination === 'registration'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Direct Registration Desk
            </button>
          </div>
        </div>

        {/* Main Content Grid: Web Link & Social Share on Left, Scannable QR Code on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Web Link Input, Copy & Quick Share buttons */}
          <div className="lg:col-span-7 space-y-5">
            {/* Direct Web Link Box with Regenerate Button */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-teal-100">
                  Official Web Invitation Link for Students
                </label>
                <button
                  type="button"
                  onClick={handleRegenerateLink}
                  disabled={isRegenerating}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors disabled:opacity-50"
                  title="Generate a fresh invite link and new QR code"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                  <span>Regenerate Link</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-slate-950/80 border border-teal-600/30 rounded-2xl p-2 shadow-inner">
                <div className="flex items-center gap-2.5 px-3 py-2 flex-1 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <input
                    type="text"
                    readOnly
                    value={inviteUrl}
                    className="w-full bg-transparent text-xs sm:text-sm text-teal-100 font-mono outline-hidden select-all truncate font-semibold"
                  />
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleRegenerateLink}
                    disabled={isRegenerating}
                    className="p-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 rounded-xl transition-colors border border-slate-700"
                    title="Regenerate fresh link token"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all shrink-0 active:scale-95"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-teal-300/70 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Public student portal link · Accessible on campus Wi-Fi, hostels, and mobile data.</span>
              </p>
            </div>

            {/* Quick Share Buttons (Native, WhatsApp, Telegram) */}
            <div className="space-y-2">
              <span className="block text-[11px] font-semibold text-teal-300">
                Instant 1-Click Sharing:
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Portal</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Share on WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleTelegramShare}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#229ED9] hover:bg-[#1e8ec3] text-white text-xs font-bold shadow-md transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Telegram</span>
                </button>
              </div>
            </div>

            {/* Pre-written Campus Invitation Message Box */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-teal-100">
                <span className="font-semibold flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pre-formatted Student Invite Message</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="text-amber-400 hover:text-amber-300 font-bold underline text-[11px] transition-colors"
                >
                  {copiedMessage ? 'Copied Message!' : 'Copy Full Text'}
                </button>
              </div>
              <p className="text-xs text-teal-100/80 italic bg-black/20 p-3 rounded-xl border border-white/5 leading-relaxed font-mono">
                "{inviteMessage}"
              </p>
            </div>
          </div>

          {/* Right: Live Generated QR Code Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[320px] bg-white rounded-3xl p-6 text-slate-900 shadow-2xl border border-slate-100 text-center space-y-4">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-slate-800">
                  <QrCode className="w-3 h-3 text-teal-800" />
                  Live Mobile QR
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  Scan to Open on Phone
                </h3>
                <p className="text-[11px] text-slate-500">
                  Point your smartphone camera to access and register instantly.
                </p>
              </div>

              {/* QR Image */}
              <div className="relative aspect-square max-w-[220px] mx-auto bg-slate-50 p-3 rounded-2xl border border-slate-200/80 shadow-inner flex items-center justify-center">
                {qrCodeUrl ? (
                  <img
                    src={qrCodeUrl}
                    alt="Campus Events Invitation QR Code"
                    className={`w-full h-full object-contain rounded-lg transition-opacity duration-300 ${
                      isRegenerating ? 'opacity-40 animate-pulse' : 'opacity-100'
                    }`}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 animate-pulse">
                    Generating QR Code...
                  </div>
                )}
              </div>

              {/* QR Action Buttons */}
              <div className="pt-1 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download QR</span>
                </button>

                <button
                  type="button"
                  onClick={handleRegenerateLink}
                  disabled={isRegenerating}
                  className="flex items-center justify-center gap-1 px-3 py-2.5 bg-teal-50 hover:bg-teal-100 text-slate-800 font-bold text-xs rounded-xl transition-colors shrink-0 border border-teal-100"
                  title="Regenerate QR Code"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center justify-center p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors shrink-0"
                  title="Copy link"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="text-[10px] text-slate-400 font-medium">
                Official Campus Registration Portal · Event Desk Near Auditorium
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
