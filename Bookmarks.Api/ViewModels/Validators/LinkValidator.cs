using FluentValidation;

namespace Bookmarks.Api.ViewModels.Validators
{
    public class LinkValidator : AbstractValidator<Link>
    {
        public LinkValidator()
        {
            RuleFor(x => x.Url)
                .NotEmpty().WithMessage("Url is required")
                .ChildRules(x => x.RuleFor(y => y).Must(x => Uri.TryCreate(x, UriKind.Absolute, out _)).WithMessage("Url is not valid"));
        }
    }
}
